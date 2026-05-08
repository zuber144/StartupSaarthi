"""
Document Agent
Responsible for generating pitch summaries, executive summaries, elevator pitches,
application guidance, and document checklists. Operates at ~75-85% accuracy tier.
"""
import json
import logging

from app.agents.base import BaseAgent
from app.utils.helpers import build_startup_profile_summary

logger = logging.getLogger(__name__)


class DocumentAgent(BaseAgent):
    """
    Document generation agent that creates professional startup documents
    and application preparation materials.
    """

    def __init__(self):
        super().__init__(
            agent_name="document",
            model_name="gemini-1.5-flash",
            temperature=0.5,  # Slightly higher for creative writing
        )

    async def execute(self, task_input: dict) -> dict:
        """
        Main execution: generate all documents.
        
        task_input keys:
            - startup_profile: dict with startup details
            - target_schemes: optional list of scheme names to tailor docs for
        """
        startup_profile = task_input.get("startup_profile", {})
        target_schemes = task_input.get("target_schemes", [])

        profile_summary = build_startup_profile_summary(startup_profile)
        schemes_context = ""
        if target_schemes:
            schemes_context = f"\nTARGET SCHEMES: {', '.join(target_schemes)}"

        prompt = f"""You are an expert startup document writer and pitch consultant for Indian startups.

Create professional documents for this startup that can be used for funding applications and investor presentations.

STARTUP PROFILE:
{profile_summary}
{schemes_context}

Generate the following documents. Return JSON with this exact structure:
{{
  "executive_summary": {{
    "title": "Executive Summary - [Startup Name]",
    "content": "A professional 300-400 word executive summary covering the problem, solution, market opportunity, business model, team, traction, and funding needs. Write in formal business language.",
    "key_highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
  }},
  "elevator_pitch": {{
    "pitch_60_seconds": "A compelling 60-second elevator pitch script that hooks the listener, explains the problem-solution fit, and ends with a clear ask.",
    "pitch_30_seconds": "A concise 30-second version for quick introductions.",
    "key_talking_points": ["Point 1", "Point 2", "Point 3"]
  }},
  "application_checklist": {{
    "mandatory_documents": [
      {{
        "document": "Document name",
        "description": "What this document should contain",
        "status_tip": "How to prepare this"
      }}
    ],
    "recommended_documents": [
      {{
        "document": "Document name",
        "description": "What this document should contain",
        "why_helpful": "Why including this helps"
      }}
    ]
  }},
  "application_guidance": {{
    "preparation_steps": [
      {{
        "step": 1,
        "title": "Step title",
        "description": "Detailed step description",
        "estimated_time": "1-2 days"
      }}
    ],
    "common_mistakes": ["Mistake 1 to avoid", "Mistake 2"],
    "success_tips": ["Tip 1", "Tip 2"]
  }},
  "startup_overview": {{
    "one_liner": "One-line description of the startup",
    "problem_statement": "Clear problem statement",
    "solution": "Solution description",
    "target_market": "Target market description",
    "competitive_advantage": "What sets this startup apart",
    "funding_requirement": "How much funding and for what"
  }}
}}

Write professionally and specifically for the Indian startup ecosystem. Return ONLY JSON."""

        result = await self.gemini.generate_json(prompt, fallback={
            "executive_summary": {
                "title": "Executive Summary",
                "content": "Unable to generate at this time.",
                "key_highlights": [],
            },
            "elevator_pitch": {
                "pitch_60_seconds": "",
                "pitch_30_seconds": "",
                "key_talking_points": [],
            },
            "application_checklist": {
                "mandatory_documents": [],
                "recommended_documents": [],
            },
            "application_guidance": {
                "preparation_steps": [],
                "common_mistakes": [],
                "success_tips": [],
            },
            "startup_overview": {
                "one_liner": "",
                "problem_statement": "",
                "solution": "",
                "target_market": "",
                "competitive_advantage": "",
                "funding_requirement": "",
            },
        })
        return result
