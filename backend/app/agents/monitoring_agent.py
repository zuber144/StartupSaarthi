"""
Monitoring Agent
Responsible for tracking deadlines, monitoring applications, generating reminders,
and creating notifications. Operates at ~75-85% accuracy tier.
"""
import json
import logging
from datetime import datetime, timezone

from app.agents.base import BaseAgent

logger = logging.getLogger(__name__)


class MonitoringAgent(BaseAgent):
    """
    Monitoring agent that tracks application deadlines, generates reminders,
    and creates notification triggers.
    """

    def __init__(self):
        super().__init__(
            agent_name="monitoring",
            model_name="gemini-1.5-flash",
            temperature=0.2,  # Low temperature for factual deadline tracking
        )

    async def execute(self, task_input: dict) -> dict:
        """
        Main execution: analyze deadlines and generate monitoring data.
        
        task_input keys:
            - startup_profile: dict with startup details
            - applications: list of application dicts (from DB)
            - schemes: list of scheme dicts with deadline info
            - eligibility_results: optional, from Research+Eligibility agent
        """
        startup_profile = task_input.get("startup_profile", {})
        applications = task_input.get("applications", [])
        schemes = task_input.get("schemes", [])
        eligibility_results = task_input.get("eligibility_results", {})

        startup_name = startup_profile.get("startup_name", "Your Startup")
        now = datetime.now(timezone.utc).isoformat()

        # Build context for Gemini
        apps_text = json.dumps(applications, indent=2, default=str) if applications else "No active applications"
        schemes_text = json.dumps(schemes[:10], indent=2, default=str) if schemes else "No schemes loaded"

        eligible_schemes = []
        if eligibility_results and "matching_schemes" in eligibility_results:
            eligible_schemes = [
                s.get("scheme_name", "Unknown")
                for s in eligibility_results.get("matching_schemes", [])
                if s.get("status") in ("eligible", "partially_eligible")
            ]

        prompt = f"""You are a startup application monitoring assistant.

Analyze the following data and generate monitoring insights, reminders, and notifications.

STARTUP: {startup_name}
CURRENT DATE: {now}

ACTIVE APPLICATIONS:
{apps_text}

AVAILABLE SCHEMES:
{schemes_text}

ELIGIBLE SCHEMES NOT YET APPLIED: {json.dumps(eligible_schemes)}

Generate monitoring data. Return JSON with this exact structure:
{{
  "deadlines": [
    {{
      "scheme_name": "...",
      "deadline": "YYYY-MM-DD or 'Rolling/Open'",
      "days_remaining": 14,
      "urgency": "critical" | "upcoming" | "comfortable" | "unknown",
      "action_needed": "What to do before deadline"
    }}
  ],
  "reminders": [
    {{
      "title": "Reminder title",
      "message": "Detailed reminder message",
      "due_date": "YYYY-MM-DD",
      "priority": "high" | "medium" | "low",
      "type": "deadline" | "follow_up" | "document_prep" | "application"
    }}
  ],
  "status_updates": [
    {{
      "application_scheme": "Scheme name",
      "current_status": "pending" | "under_review" | "approved" | "rejected",
      "next_steps": "What to expect next",
      "estimated_timeline": "Expected timeline for update"
    }}
  ],
  "notifications": [
    {{
      "title": "Notification title",
      "message": "Notification message",
      "type": "info" | "warning" | "action_required" | "success",
      "trigger": "What triggered this notification"
    }}
  ],
  "unapplied_opportunities": [
    {{
      "scheme_name": "...",
      "reason_to_apply": "Why this is worth applying to",
      "suggested_action": "What to do to apply"
    }}
  ]
}}

Be practical and action-oriented. Return ONLY JSON."""

        result = await self.gemini.generate_json(prompt, fallback={
            "deadlines": [],
            "reminders": [],
            "status_updates": [],
            "notifications": [],
            "unapplied_opportunities": [],
        })
        return result
