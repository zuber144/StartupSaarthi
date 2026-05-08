import json
from app.agents.base import BaseAgent

class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__()

    async def search_schemes(self, startup_profile: dict):
        """
        Uses Gemini to discover relevant government schemes based on the startup profile.
        """
        prompt = f"""
        You are an expert government scheme researcher for Indian startups.
        Based on the following startup profile, identify 5 relevant government schemes or grants.
        
        Startup Profile:
        {json.dumps(startup_profile, indent=2)}
        
        Return the result as a JSON list of objects with the following keys:
        - scheme_name
        - ministry
        - description
        - funding_amount (estimated string)
        - eligibility_summary
        - application_link (if known, otherwise null)
        
        Return ONLY the JSON list.
        """
        
        response_text = await self.get_response(prompt)
        
        # Clean response text in case of markdown formatting
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        try:
            schemes = json.loads(response_text)
            return {"schemes": schemes}
        except Exception as e:
            return {"error": f"Failed to parse AI response: {str(e)}", "raw": response_text}
