"""
Research + Eligibility Agent (Combined)
Responsible for scheme discovery, web scraping, data structuring, eligibility checking,
and gap analysis. Operates at ~75-85% accuracy tier.
"""
import json
import logging
from typing import Optional

from app.agents.base import BaseAgent
from app.utils.helpers import build_startup_profile_summary, truncate_text

logger = logging.getLogger(__name__)


class ResearchEligibilityAgent(BaseAgent):
    """
    Combined Research + Eligibility agent.
    
    Research: Discovers government schemes, scrapes websites, structures data via Gemini.
    Eligibility: Checks startup eligibility, generates scores, identifies gaps.
    """

    def __init__(self):
        super().__init__(
            agent_name="research_eligibility",
            model_name="gemini-1.5-flash",
            temperature=0.2,
        )

    async def execute(self, task_input: dict) -> dict:
        """
        Main execution: find matching schemes and check eligibility.
        
        task_input keys:
            - startup_profile: dict with startup details
            - schemes: list of scheme dicts from DB (pre-loaded)
        """
        startup_profile = task_input.get("startup_profile", {})
        schemes = task_input.get("schemes", [])

        if not schemes:
            # If no schemes in DB, use Gemini to suggest relevant ones
            schemes = await self._discover_schemes_via_ai(startup_profile)

        # Check eligibility for each scheme
        eligibility_results = await self._check_eligibility_batch(startup_profile, schemes)

        return eligibility_results

    # ------------------------------------------------------------------ #
    #  Scheme Discovery
    # ------------------------------------------------------------------ #

    async def _discover_schemes_via_ai(self, startup_profile: dict) -> list[dict]:
        """Use Gemini to identify relevant schemes when DB is empty."""
        profile_summary = build_startup_profile_summary(startup_profile)
        prompt = f"""You are an expert advisor on Indian government schemes for startups.

Based on the following startup profile, identify the top 8 most relevant government funding schemes, grants, or programs that this startup could apply for.

STARTUP PROFILE:
{profile_summary}

Return a JSON array where each element has these keys:
- scheme_name (string)
- ministry (string)
- description (string, 2-3 sentences)
- eligibility_summary (string)
- funding_amount (string, e.g. "Up to ₹50 Lakhs")
- application_link (string or null)
- relevance_reason (string, why this scheme fits this startup)

Return ONLY the JSON array, no other text."""

        result = await self.gemini.generate_json(prompt, fallback=[])
        if isinstance(result, list):
            return result
        return result.get("schemes", []) if isinstance(result, dict) else []

    async def scrape_and_structure_schemes(self, raw_text: str, source_name: str) -> list[dict]:
        """
        Takes raw scraped text from a government website and uses Gemini
        to convert it into structured JSON scheme data.
        """
        truncated = truncate_text(raw_text, 12000)
        prompt = f"""You are an expert at extracting government scheme information.

Below is raw text scraped from the {source_name} website. Extract ALL government funding schemes, grants, and programs mentioned.

RAW TEXT:
{truncated}

For each scheme, extract the following into a JSON array:
- scheme_name (string)
- ministry (string)
- description (string, 2-3 sentences)
- eligibility (string, who can apply)
- funding_amount (string)
- deadline (string or null)
- application_link (string or null)

Return ONLY the JSON array. If no schemes are found, return an empty array []."""

        result = await self.gemini.generate_json(prompt, fallback=[])
        if isinstance(result, list):
            return result
        return []

    # ------------------------------------------------------------------ #
    #  Eligibility Checking
    # ------------------------------------------------------------------ #

    async def _check_eligibility_batch(self, startup_profile: dict, schemes: list[dict]) -> dict:
        """Check eligibility for all schemes at once using Gemini."""
        profile_summary = build_startup_profile_summary(startup_profile)

        schemes_text = ""
        for i, scheme in enumerate(schemes[:10], 1):  # Limit to 10 schemes
            name = scheme.get("scheme_name", f"Scheme {i}")
            desc = scheme.get("description", "N/A")
            elig = scheme.get("eligibility", scheme.get("eligibility_summary", "N/A"))
            amount = scheme.get("funding_amount", "N/A")
            schemes_text += f"\n{i}. {name}\n   Description: {desc}\n   Eligibility: {elig}\n   Funding: {amount}\n"

        prompt = f"""You are an expert startup eligibility assessor for Indian government schemes.

STARTUP PROFILE:
{profile_summary}

AVAILABLE SCHEMES:
{schemes_text}

For each scheme, analyze whether this startup is eligible. Return a JSON object with:
{{
  "matching_schemes": [
    {{
      "scheme_name": "...",
      "eligibility_score": 85,
      "status": "eligible" | "partially_eligible" | "not_eligible",
      "matching_criteria": ["criteria1", "criteria2"],
      "missing_requirements": ["requirement1"],
      "recommendation": "Brief recommendation for this scheme"
    }}
  ],
  "overall_eligibility_summary": "Brief summary of startup's overall eligibility position",
  "recommended_actions": ["Action 1 to improve eligibility", "Action 2"],
  "top_opportunities": ["Best scheme name 1", "Best scheme name 2"]
}}

Be realistic with scores. Return ONLY JSON."""

        result = await self.gemini.generate_json(prompt, fallback={
            "matching_schemes": [],
            "overall_eligibility_summary": "Unable to assess eligibility at this time.",
            "recommended_actions": [],
            "top_opportunities": [],
        })
        return result

    async def check_single_eligibility(self, startup_profile: dict, scheme: dict) -> dict:
        """Check eligibility for a single scheme."""
        profile_summary = build_startup_profile_summary(startup_profile)
        scheme_name = scheme.get("scheme_name", "Unknown")
        scheme_desc = scheme.get("description", "N/A")
        scheme_elig = json.dumps(scheme.get("eligibility_rules", {}), indent=2)

        prompt = f"""Assess eligibility for this startup against this specific government scheme.

STARTUP PROFILE:
{profile_summary}

SCHEME: {scheme_name}
Description: {scheme_desc}
Eligibility Rules: {scheme_elig}

Return JSON:
{{
  "scheme_name": "{scheme_name}",
  "eligibility_score": <0-100>,
  "status": "eligible" | "partially_eligible" | "not_eligible",
  "matching_criteria": ["..."],
  "missing_requirements": ["..."],
  "improvement_tips": ["..."]
}}

Return ONLY JSON."""

        return await self.gemini.generate_json(prompt, fallback={
            "scheme_name": scheme_name,
            "eligibility_score": 0,
            "status": "not_eligible",
            "matching_criteria": [],
            "missing_requirements": ["Unable to assess"],
            "improvement_tips": [],
        })
