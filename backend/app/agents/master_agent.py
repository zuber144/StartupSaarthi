"""
Master Agent — Top-Level Orchestration Controller
The brain of the Startup Saarthi AI system. Receives user input, classifies intent,
decomposes tasks, routes to specialized agents, aggregates results, and coordinates
with the Validation Agent. Operates at 90-95% accuracy tier.
"""
import asyncio
import json
import logging
from typing import Any

from app.agents.base import BaseAgent
from app.agents.research_eligibility_agent import ResearchEligibilityAgent
from app.agents.strategy_agent import StrategyAgent
from app.agents.document_agent import DocumentAgent
from app.agents.monitoring_agent import MonitoringAgent
from app.agents.validation_agent import ValidationAgent
from app.utils.helpers import build_startup_profile_summary

logger = logging.getLogger(__name__)

# Intent-to-Agent mapping
INTENT_AGENT_MAP = {
    "full_analysis": ["research_eligibility", "strategy", "document", "monitoring"],
    "discover_schemes": ["research_eligibility"],
    "check_eligibility": ["research_eligibility"],
    "get_strategy": ["research_eligibility", "strategy"],
    "generate_docs": ["document"],
    "check_status": ["monitoring"],
}


class MasterAgent(BaseAgent):
    """
    Master orchestration agent — the brain of the system.
    
    Flow:
    1. Classify user intent
    2. Decompose into subtasks
    3. Route to appropriate agents (parallel where possible)
    4. Aggregate all results
    5. Send to Validation Agent
    6. Return polished response
    """

    def __init__(self):
        super().__init__(
            agent_name="master",
            model_name="gemini-1.5-pro",  # Pro model for higher accuracy
            temperature=0.2,
        )
        # Initialize all sub-agents
        self._agents = {
            "research_eligibility": ResearchEligibilityAgent(),
            "strategy": StrategyAgent(),
            "document": DocumentAgent(),
            "monitoring": MonitoringAgent(),
        }
        self._validation_agent = ValidationAgent()

    async def execute(self, task_input: dict) -> dict:
        """
        Main orchestration entry point.
        
        task_input keys:
            - user_input: str — what the user asked / wants
            - startup_profile: dict — startup details
            - schemes: list — schemes from DB
            - applications: list — existing applications from DB
        """
        user_input = task_input.get("user_input", "")
        startup_profile = task_input.get("startup_profile", {})
        schemes = task_input.get("schemes", [])
        applications = task_input.get("applications", [])

        # Step 1: Classify intent
        intent = await self._classify_intent(user_input, startup_profile)
        logger.info(f"[Master] Classified intent: {intent}")

        # Step 2: Determine which agents to invoke
        agents_to_run = INTENT_AGENT_MAP.get(intent, ["research_eligibility"])

        # Step 3: Build task inputs for each agent
        agent_tasks = self._build_agent_tasks(
            agents_to_run, startup_profile, schemes, applications
        )

        # Step 4: Execute agents (parallel for independent agents, sequential for dependent)
        agent_results = await self._execute_agents(agents_to_run, agent_tasks)

        # Step 4b: If strategy needs eligibility results, run it after research
        if "strategy" in agents_to_run and "research_eligibility" in agent_results:
            re_data = agent_results["research_eligibility"].get("data", {})
            agent_tasks["strategy"]["eligibility_results"] = re_data
            strategy_result = await self._agents["strategy"].safe_execute(
                agent_tasks["strategy"]
            )
            agent_results["strategy"] = strategy_result

        # Step 5: Aggregate all results
        combined = self._aggregate_results(agent_results, intent)

        # Step 6: Send to Validation Agent
        validated = await self._validate(combined, startup_profile, schemes)

        # Step 7: Build final response
        final_response = {
            "intent": intent,
            "agents_executed": list(agent_results.keys()),
            "results": validated,
            "metadata": {
                "agents_status": {
                    name: r.get("status", "unknown")
                    for name, r in agent_results.items()
                },
                "execution_times": {
                    name: r.get("execution_time_seconds", 0)
                    for name, r in agent_results.items()
                },
            },
        }

        return final_response

    # ------------------------------------------------------------------ #
    #  Intent Classification
    # ------------------------------------------------------------------ #

    async def _classify_intent(self, user_input: str, startup_profile: dict) -> str:
        """Use Gemini to classify the user's intent into a predefined category."""
        if not user_input or user_input.strip() == "":
            return "full_analysis"

        prompt = f"""You are an intent classifier for a startup funding platform.

Classify the user's request into exactly ONE of these categories:
- full_analysis: Complete analysis (schemes + eligibility + strategy + docs + monitoring)
- discover_schemes: Find government schemes/grants
- check_eligibility: Check eligibility for schemes
- get_strategy: Get funding strategy and roadmap
- generate_docs: Generate pitch/documents
- check_status: Check application status/deadlines

USER INPUT: "{user_input}"

Return ONLY the category name as a single word (e.g., "full_analysis"). No other text."""

        response = await self.gemini.generate_text(prompt)
        response = response.strip().strip('"').strip("'").lower()

        valid_intents = list(INTENT_AGENT_MAP.keys())
        if response in valid_intents:
            return response

        # Fallback: keyword matching
        input_lower = user_input.lower()
        if any(w in input_lower for w in ["scheme", "grant", "discover", "find", "search"]):
            return "discover_schemes"
        if any(w in input_lower for w in ["eligible", "eligibility", "qualify"]):
            return "check_eligibility"
        if any(w in input_lower for w in ["strategy", "roadmap", "plan", "rank"]):
            return "get_strategy"
        if any(w in input_lower for w in ["pitch", "document", "summary", "checklist"]):
            return "generate_docs"
        if any(w in input_lower for w in ["status", "deadline", "monitor", "track"]):
            return "check_status"

        return "full_analysis"

    # ------------------------------------------------------------------ #
    #  Task Building
    # ------------------------------------------------------------------ #

    def _build_agent_tasks(
        self,
        agents_to_run: list[str],
        startup_profile: dict,
        schemes: list[dict],
        applications: list[dict],
    ) -> dict[str, dict]:
        """Build task input dicts for each agent."""
        tasks = {}

        if "research_eligibility" in agents_to_run:
            tasks["research_eligibility"] = {
                "startup_profile": startup_profile,
                "schemes": schemes,
            }

        if "strategy" in agents_to_run:
            tasks["strategy"] = {
                "startup_profile": startup_profile,
                "eligibility_results": {},  # Will be filled after research runs
            }

        if "document" in agents_to_run:
            tasks["document"] = {
                "startup_profile": startup_profile,
                "target_schemes": [s.get("scheme_name", "") for s in schemes[:5]],
            }

        if "monitoring" in agents_to_run:
            tasks["monitoring"] = {
                "startup_profile": startup_profile,
                "applications": applications,
                "schemes": schemes,
            }

        return tasks

    # ------------------------------------------------------------------ #
    #  Agent Execution
    # ------------------------------------------------------------------ #

    async def _execute_agents(
        self, agents_to_run: list[str], agent_tasks: dict
    ) -> dict[str, dict]:
        """
        Execute agents in parallel where possible.
        Research+Eligibility runs first if strategy also needs to run (dependency).
        Document and Monitoring are always independent.
        """
        results = {}

        # Identify independent agents (can run in parallel)
        independent = []
        dependent = []

        for agent_name in agents_to_run:
            if agent_name == "strategy":
                dependent.append(agent_name)  # Depends on research results
            elif agent_name in agent_tasks:
                independent.append(agent_name)

        # Run independent agents in parallel
        if independent:
            parallel_tasks = []
            parallel_names = []
            for name in independent:
                if name in self._agents and name in agent_tasks:
                    parallel_tasks.append(
                        self._agents[name].safe_execute(agent_tasks[name])
                    )
                    parallel_names.append(name)

            if parallel_tasks:
                parallel_results = await asyncio.gather(*parallel_tasks)
                for name, result in zip(parallel_names, parallel_results):
                    results[name] = result

        return results

    # ------------------------------------------------------------------ #
    #  Result Aggregation
    # ------------------------------------------------------------------ #

    def _aggregate_results(self, agent_results: dict, intent: str) -> dict:
        """
        Combine all agent outputs into the Strict Intelligence Contract v1.0.
        This structure is deterministic and shared between backend and frontend.
        """
        # Initialize the contract
        contract = {
            "contract_version": "1.0",
            "intent": intent,
            "readiness_score": 0,
            "confidence_score": 0.0,
            "schemes": [],
            "roadmap": [],
            "gaps": [],
            "validation_note": "",
            "raw_agent_data": {}, # Preserve for deep debugging if needed
        }

        # 1. Extract Research & Eligibility
        re_result = agent_results.get("research_eligibility", {})
        if re_result.get("status") == "success":
            data = re_result.get("data", {})
            contract["schemes"] = data.get("schemes") or data.get("eligible_schemes") or []
            contract["gaps"] = data.get("missing_requirements") or data.get("gaps") or []
            contract["raw_agent_data"]["research_eligibility"] = data

        # 2. Extract Strategy
        strat_result = agent_results.get("strategy", {})
        if strat_result.get("status") == "success":
            data = strat_result.get("data", {})
            contract["readiness_score"] = data.get("readiness_score") or 0
            contract["roadmap"] = data.get("roadmap_steps") or data.get("roadmap") or []
            contract["raw_agent_data"]["strategy"] = data

        # Ensure all items in schemes have the required fields
        normalized_schemes = []
        raw_schemes = contract["schemes"] or []
        for s in raw_schemes:
            if not isinstance(s, dict):
                continue
            normalized_schemes.append({
                "scheme_name": s.get("scheme_name") or s.get("name") or "Unknown Scheme",
                "approval_probability": s.get("approval_probability") or s.get("probability") or 0.5,
                "why_matched": s.get("why_matched") or s.get("reason") or s.get("eligibility_reason") or "Matched based on startup profile.",
                "missing_requirements": s.get("missing_requirements") or [],
                "recommendation": s.get("recommendation") or "Apply following the roadmap guidance.",
                "eligibility_confidence": s.get("eligibility_confidence") or 0.8,
            })
        contract["schemes"] = normalized_schemes

        return contract

    # ------------------------------------------------------------------ #
    #  Validation
    # ------------------------------------------------------------------ #

    async def _validate(
        self, contract: dict, startup_profile: dict, schemes: list[dict]
    ) -> dict:
        """
        Send the Intelligence Contract to the Validation Agent for audit.
        Populates validation_note and confidence_score.
        """
        try:
            validation_input = {
                "combined_output": contract,
                "startup_profile": startup_profile,
                "known_schemes": schemes,
            }
            validation_result = await self._validation_agent.safe_execute(validation_input)
            
            if validation_result.get("status") == "success":
                val_data = validation_result.get("data", {})
                contract["validation_note"] = val_data.get("note") or val_data.get("validation_note") or "Analysis validated by AI audit."
                contract["confidence_score"] = val_data.get("confidence_score") or val_data.get("confidence") or 0.9
            else:
                contract["validation_note"] = "Validation agent skipped. Use with caution."
                contract["confidence_score"] = 0.7
            
            return contract
        except Exception as e:
            logger.error(f"[Master] Validation error: {e}")
            contract["validation_note"] = f"Validation system error: {str(e)}"
            contract["confidence_score"] = 0.5
            return contract
