"""
Startup Service — CRUD operations for startup profiles.
"""
import uuid
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.startup import Startup


async def create_startup(
    db: AsyncSession,
    user_id: uuid.UUID,
    data: dict,
) -> Startup:
    """Create a new startup profile."""
    startup = Startup(
        user_id=user_id,
        startup_name=data["startup_name"],
        domain=data.get("domain"),
        stage=data.get("stage"),
        team_size=data.get("team_size", 1),
        revenue=data.get("revenue", 0.0),
        location=data.get("location"),
        business_idea=data.get("business_idea"),
        documents=data.get("documents", {}),
        metrics=data.get("metrics", {}),
    )
    db.add(startup)
    await db.commit()
    await db.refresh(startup)
    return startup


async def get_startup(db: AsyncSession, startup_id: uuid.UUID) -> Optional[Startup]:
    """Get a startup by ID."""
    result = await db.execute(select(Startup).filter(Startup.id == startup_id))
    return result.scalars().first()


async def get_user_startups(db: AsyncSession, user_id: uuid.UUID) -> list[Startup]:
    """Get all startups for a user."""
    result = await db.execute(
        select(Startup).filter(Startup.user_id == user_id).order_by(Startup.created_at.desc())
    )
    return list(result.scalars().all())


async def update_startup(
    db: AsyncSession,
    startup_id: uuid.UUID,
    data: dict,
) -> Optional[Startup]:
    """Update a startup profile."""
    startup = await get_startup(db, startup_id)
    if not startup:
        return None

    for key, value in data.items():
        if value is not None and hasattr(startup, key):
            setattr(startup, key, value)

    await db.commit()
    await db.refresh(startup)
    return startup


async def delete_startup(db: AsyncSession, startup_id: uuid.UUID) -> bool:
    """Delete a startup."""
    startup = await get_startup(db, startup_id)
    if not startup:
        return False
    await db.delete(startup)
    await db.commit()
    return True


def startup_to_dict(startup: Startup) -> dict:
    """Convert a Startup ORM object to a dict for agent consumption."""
    return {
        "id": str(startup.id),
        "startup_name": startup.startup_name,
        "domain": startup.domain,
        "stage": startup.stage,
        "team_size": startup.team_size,
        "revenue": startup.revenue,
        "location": startup.location,
        "business_idea": startup.business_idea,
        "documents": startup.documents or {},
        "metrics": startup.metrics or {},
    }
