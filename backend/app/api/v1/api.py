from fastapi import APIRouter
from app.api.v1.endpoints import auth, startups, schemes, ai, applications, notifications

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(startups.router, prefix="/startups", tags=["startups"])
api_router.include_router(schemes.router, prefix="/schemes", tags=["schemes"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
