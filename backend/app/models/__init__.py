from app.database.base import Base
from app.models.user import User
from app.models.startup import Startup
from app.models.scheme import GovernmentScheme
from app.models.application import Application
from app.models.ai_result import AIResult
from app.models.notification import Notification

# This list is useful for Alembic to find all models
__all__ = [
    "Base",
    "User",
    "Startup",
    "GovernmentScheme",
    "Application",
    "AIResult",
    "Notification",
]
