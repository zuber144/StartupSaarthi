import google.generativeai as genai
from app.core.config import settings

class BaseAgent:
    def __init__(self, model_name: str = "gemini-1.5-pro"):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(model_name)

    async def get_response(self, prompt: str):
        # Note: google-generativeai is currently synchronous in its SDK
        # but we can wrap it or use it as is for now.
        response = self.model.generate_content(prompt)
        return response.text
