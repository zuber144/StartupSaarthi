"""
Shared Gemini AI Client for all agents.
Provides structured JSON generation, text generation, retry logic, and error handling.
"""
import json
import time
import logging
from typing import Optional

import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)


class GeminiClient:
    """
    Centralized Gemini API client used by all agents.
    
    - Configurable model (pro for Master/Validation, flash for processing agents)
    - Automatic JSON extraction from markdown-fenced responses
    - Retry with exponential backoff (3 attempts)
    - Structured error returns instead of exceptions
    """

    def __init__(self, model_name: str = "gemini-1.5-flash", temperature: float = 0.3):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            model_name,
            generation_config=genai.GenerationConfig(
                temperature=temperature,
                top_p=0.95,
                max_output_tokens=8192,
            ),
        )
        self.model_name = model_name
        self._max_retries = 3
        self._base_delay = 2  # seconds

    # ------------------------------------------------------------------ #
    #  Public API
    # ------------------------------------------------------------------ #

    async def generate_json(self, prompt: str, fallback: Optional[dict] = None) -> dict:
        """
        Send a prompt to Gemini and parse the response as JSON.
        Returns parsed dict on success, or a structured error dict on failure.
        """
        raw = await self._call_with_retry(prompt)
        if raw is None:
            return fallback or {"error": "Gemini API call failed after retries"}

        cleaned = self._strip_markdown_fences(raw)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Try to extract JSON from mixed text
            extracted = self._extract_json_from_text(cleaned)
            if extracted is not None:
                return extracted
            logger.warning("Failed to parse Gemini response as JSON")
            return fallback or {"error": "Failed to parse AI response", "raw": raw[:500]}

    async def generate_text(self, prompt: str) -> str:
        """
        Send a prompt to Gemini and return the raw text response.
        """
        raw = await self._call_with_retry(prompt)
        return raw or ""

    # ------------------------------------------------------------------ #
    #  Internal helpers
    # ------------------------------------------------------------------ #

    async def _call_with_retry(self, prompt: str) -> Optional[str]:
        """Call Gemini with exponential backoff retry."""
        last_error = None
        for attempt in range(1, self._max_retries + 1):
            try:
                response = self.model.generate_content(prompt)
                if response and response.text:
                    return response.text
                logger.warning(f"Empty response from Gemini (attempt {attempt})")
            except Exception as e:
                last_error = e
                logger.error(f"Gemini API error (attempt {attempt}/{self._max_retries}): {e}")
                if attempt < self._max_retries:
                    delay = self._base_delay * (2 ** (attempt - 1))
                    time.sleep(delay)
        logger.error(f"Gemini API failed after {self._max_retries} retries: {last_error}")
        return None

    @staticmethod
    def _strip_markdown_fences(text: str) -> str:
        """Remove ```json ... ``` or ``` ... ``` wrappers from Gemini output."""
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return text.strip()

    @staticmethod
    def _extract_json_from_text(text: str) -> Optional[dict]:
        """Try to find and parse the first JSON object or array in text."""
        # Look for object
        start = text.find("{")
        if start != -1:
            depth = 0
            for i in range(start, len(text)):
                if text[i] == "{":
                    depth += 1
                elif text[i] == "}":
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(text[start : i + 1])
                        except json.JSONDecodeError:
                            break
        # Look for array
        start = text.find("[")
        if start != -1:
            depth = 0
            for i in range(start, len(text)):
                if text[i] == "[":
                    depth += 1
                elif text[i] == "]":
                    depth -= 1
                    if depth == 0:
                        try:
                            return json.loads(text[start : i + 1])
                        except json.JSONDecodeError:
                            break
        return None
