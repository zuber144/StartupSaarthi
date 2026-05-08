import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Startup Saarthi AI"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    
    # AI
    GEMINI_API_KEY: str
    
    # Notifications
    WHATSAPP_API_KEY: str = ""
    EMAIL_API_KEY: str = ""
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
