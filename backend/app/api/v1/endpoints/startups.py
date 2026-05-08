"""
Startup CRUD endpoints.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.startup import StartupCreate, StartupUpdate, StartupRead
from app.services import startup_service

router = APIRouter()


@router.post("/", response_model=StartupRead, status_code=status.HTTP_201_CREATED)
async def create_startup(
    data: StartupCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new startup profile for the current user."""
    startup = await startup_service.create_startup(
        db, current_user.id, data.model_dump()
    )
    return startup


@router.get("/", response_model=list[StartupRead])
async def list_startups(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all startups belonging to the current user."""
    return await startup_service.get_user_startups(db, current_user.id)


@router.get("/{startup_id}", response_model=StartupRead)
async def get_startup(
    startup_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific startup by ID."""
    startup = await startup_service.get_startup(db, startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this startup")
    return startup


@router.put("/{startup_id}", response_model=StartupRead)
async def update_startup(
    startup_id: UUID,
    data: StartupUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a startup profile."""
    startup = await startup_service.get_startup(db, startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this startup")
    updated = await startup_service.update_startup(
        db, startup_id, data.model_dump(exclude_unset=True)
    )
    return updated


@router.delete("/{startup_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_startup(
    startup_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a startup."""
    startup = await startup_service.get_startup(db, startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this startup")
    await startup_service.delete_startup(db, startup_id)
