"""
Base Agent class for all AI agents in the Startup Saarthi system.
Provides shared Gemini integration, logging, and execution interface.
"""
import logging
import time
from abc import ABC, abstractmethod
from typing import Any

from app.ai.gemini import GeminiClient

logger = logging.getLogger(__name__)


class BaseAgent(ABC):
    """
    Abstract base class for all agents.
    
    Each agent must implement the `execute` method which takes a task input dict
    and returns a result dict. The base class provides:
    - GeminiClient integration
    - Prompt building helpers
    - Execution timing and logging
    - Error handling wrapper
    """

    def __init__(self, agent_name: str, model_name: str = "gemini-1.5-flash", temperature: float = 0.3):
        self.agent_name = agent_name
        self.gemini = GeminiClient(model_name=model_name, temperature=temperature)
        self.logger = logging.getLogger(f"agent.{agent_name}")

    @abstractmethod
    async def execute(self, task_input: dict) -> dict:
        """
        Execute the agent's primary task.
        Must be implemented by all subclasses.
        
        Args:
            task_input: Dict containing all necessary input data for the agent.
            
        Returns:
            Dict containing the agent's output.
        """
        pass

    async def safe_execute(self, task_input: dict) -> dict:
        """
        Wrapper around execute() with timing, logging, and error handling.
        Returns a standardized result envelope.
        """
        start = time.time()
        self.logger.info(f"[{self.agent_name}] Starting execution...")
        try:
            result = await self.execute(task_input)
            elapsed = round(time.time() - start, 2)
            self.logger.info(f"[{self.agent_name}] Completed in {elapsed}s")
            return {
                "agent": self.agent_name,
                "status": "success",
                "execution_time_seconds": elapsed,
                "data": result,
            }
        except Exception as e:
            elapsed = round(time.time() - start, 2)
            self.logger.error(f"[{self.agent_name}] Failed after {elapsed}s: {e}")
            return {
                "agent": self.agent_name,
                "status": "error",
                "execution_time_seconds": elapsed,
                "error": str(e),
                "data": {},
            }

    def _build_prompt(self, template: str, context: dict[str, Any]) -> str:
        """
        Build a prompt by substituting context values into a template string.
        Uses simple {key} replacement.
        """
        prompt = template
        for key, value in context.items():
            placeholder = "{" + key + "}"
            if placeholder in prompt:
                prompt = prompt.replace(placeholder, str(value))
        return prompt
