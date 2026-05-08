"""
Strategy Agent
Responsible for ranking schemes, estimating approval probability, generating funding strategies,
improvement suggestions, and funding roadmaps. Operates at ~75-85% accuracy tier.
"""
import json
import logging

from app.agents.base import BaseAgent
from app.utils.helpers import build_startup_profile_summary

logger = logging.getLogger(__name__)


class StrategyAgent(BaseAgent):
    """
    Strategy agent that takes eligibility results and produces actionable
    funding strategies, rankings, and roadmaps.
    """

    def __init__(self):
        super().__init__(
            agent_name="strategy",
            model_name="gemini-1.5-flash",
            temperature=0.4,
        )

    async def execute(self, task_input: dict) -> dict:
        """
        Main execution: generate comprehensive funding strategy.
        
        task_input keys:
            - startup_profile: dict with startup details
            - eligibility_results: output from Research+Eligibility agent
        """
        startup_profile = task_input.get("startup_profile", {})
        eligibility_results = task_input.get("eligibility_results", {})

        profile_summary = build_startup_profile_summary(startup_profile)
        eligibility_json = json.dumps(eligibility_results, indent=2, default=str)

        prompt = f"""You are an expert startup funding strategist for Indian startups.

Based on the startup profile and eligibility analysis, create a comprehensive funding strategy.

STARTUP PROFILE:
{profile_summary}

ELIGIBILITY ANALYSIS:
{eligibility_json}

Generate a detailed funding strategy. Return JSON with this exact structure:
{{
  "ranked_schemes": [
    {{
      "rank": 1,
      "scheme_name": "...",
      "approval_probability": 0.85,
      "priority": "high" | "medium" | "low",
      "reasoning": "Why this scheme is ranked here",
      "estimated_timeline": "2-3 months"
    }}
  ],
  "funding_strategy": {{
    "short_term": "Strategy for next 0-3 months",
    "medium_term": "Strategy for 3-6 months",
    "long_term": "Strategy for 6-12 months",
    "total_potential_funding": "Estimated total funding accessible"
  }},
  "improvement_suggestions": [
    {{
      "area": "Area to improve (e.g., DPIIT Registration)",
      "current_status": "What the startup currently has/lacks",
      "action_required": "Specific action to take",
      "impact": "How this improves funding chances",
      "difficulty": "easy" | "medium" | "hard",
      "timeline": "Estimated time to complete"
    }}
  ],
  "roadmap": [
    {{
      "phase": "Month 1-2",
      "title": "Phase title",
      "actions": ["Action 1", "Action 2"],
      "expected_outcomes": ["Outcome 1"],
      "schemes_to_apply": ["Scheme name"]
    }}
  ],
  "risk_assessment": {{
    "overall_risk": "low" | "medium" | "high",
    "key_risks": ["Risk 1", "Risk 2"],
    "mitigation_strategies": ["Strategy 1"]
  }}
}}

Be realistic with probabilities. Return ONLY JSON."""

        result = await self.gemini.generate_json(prompt, fallback={
            "ranked_schemes": [],
            "funding_strategy": {
                "short_term": "Unable to generate strategy at this time.",
                "medium_term": "",
                "long_term": "",
                "total_potential_funding": "N/A",
            },
            "improvement_suggestions": [],
            "roadmap": [],
            "risk_assessment": {
                "overall_risk": "unknown",
                "key_risks": [],
                "mitigation_strategies": [],
            },
        })
        return result
