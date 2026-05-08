"""
Application Service — CRUD operations for scheme applications.
"""
import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.application import Application


async def create_application(
    db: AsyncSession,
    startup_id: uuid.UUID,
    scheme_id: uuid.UUID,
) -> Application:
    """Create a new application."""
    application = Application(
        startup_id=startup_id,
        scheme_id=scheme_id,
        status="pending",
        approval_probability=0.0,
    )
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


async def get_startup_applications(
    db: AsyncSession,
    startup_id: uuid.UUID,
) -> list[Application]:
    """Get all applications for a startup."""
    result = await db.execute(
        select(Application)
        .filter(Application.startup_id == startup_id)
        .order_by(Application.submitted_at.desc())
    )
    return list(result.scalars().all())


async def get_application(
    db: AsyncSession,
    application_id: uuid.UUID,
) -> Optional[Application]:
    """Get a single application by ID."""
    result = await db.execute(
        select(Application).filter(Application.id == application_id)
    )
    return result.scalars().first()


async def update_application_status(
    db: AsyncSession,
    application_id: uuid.UUID,
    status: str,
    approval_probability: Optional[float] = None,
) -> Optional[Application]:
    """Update application status."""
    application = await get_application(db, application_id)
    if not application:
        return None
    application.status = status
    if approval_probability is not None:
        application.approval_probability = approval_probability
    await db.commit()
    await db.refresh(application)
    return application
