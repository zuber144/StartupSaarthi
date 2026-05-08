"""
Application tracking endpoints.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationRead
from app.services import application_service, startup_service

router = APIRouter()


class StatusUpdate(BaseModel):
    status: str
    approval_probability: Optional[float] = None


@router.post("/", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
async def create_application(
    data: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new application for a scheme."""
    # Verify startup ownership
    startup = await startup_service.get_startup(db, data.startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    application = await application_service.create_application(
        db, data.startup_id, data.scheme_id
    )
    return application


@router.get("/{startup_id}", response_model=list[ApplicationRead])
async def list_applications(
    startup_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all applications for a startup."""
    startup = await startup_service.get_startup(db, startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return await application_service.get_startup_applications(db, startup_id)


@router.put("/{application_id}/status", response_model=ApplicationRead)
async def update_status(
    application_id: UUID,
    data: StatusUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an application's status."""
    application = await application_service.get_application(db, application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    # Verify ownership through startup
    startup = await startup_service.get_startup(db, application.startup_id)
    if not startup or startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    updated = await application_service.update_application_status(
        db, application_id, data.status, data.approval_probability
    )
    return updated
