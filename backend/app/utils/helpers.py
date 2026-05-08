"""
Shared utility functions used across the application.
"""
import json
import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


def clean_json_response(text: str) -> str:
    """Strip markdown code fences from Gemini responses."""
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()


def safe_json_parse(text: str, fallback: Optional[Any] = None) -> Any:
    """Parse JSON string with fallback on failure."""
    try:
        cleaned = clean_json_response(text)
        return json.loads(cleaned)
    except (json.JSONDecodeError, TypeError):
        logger.warning(f"Failed to parse JSON: {text[:200]}...")
        return fallback


def truncate_text(text: str, max_len: int = 10000) -> str:
    """Truncate text to max_len characters for prompt size management."""
    if len(text) <= max_len:
        return text
    return text[:max_len] + "\n... [truncated]"


def build_startup_profile_summary(startup: dict) -> str:
    """Create a human-readable summary of a startup profile for AI prompts."""
    parts = []
    if startup.get("startup_name"):
        parts.append(f"Name: {startup['startup_name']}")
    if startup.get("domain"):
        parts.append(f"Domain: {startup['domain']}")
    if startup.get("stage"):
        parts.append(f"Stage: {startup['stage']}")
    if startup.get("team_size"):
        parts.append(f"Team Size: {startup['team_size']}")
    if startup.get("revenue"):
        parts.append(f"Revenue: ₹{startup['revenue']}")
    if startup.get("location"):
        parts.append(f"Location: {startup['location']}")
    if startup.get("business_idea"):
        parts.append(f"Business Idea: {startup['business_idea']}")
    return "\n".join(parts)
