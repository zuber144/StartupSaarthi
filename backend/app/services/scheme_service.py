"""
Scheme Service — CRUD + bulk upsert for government schemes.
"""
import json
import uuid
import logging
from pathlib import Path
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.scheme import GovernmentScheme

logger = logging.getLogger(__name__)

SEED_FILE = Path(__file__).parent.parent / "data" / "seed_schemes.json"


async def create_scheme(db: AsyncSession, data: dict) -> GovernmentScheme:
    """Create a single scheme."""
    scheme = GovernmentScheme(
        scheme_name=data["scheme_name"],
        ministry=data.get("ministry", ""),
        description=data.get("description"),
        eligibility_rules=data.get("eligibility_rules", {}),
        funding_amount=data.get("funding_amount"),
        deadline=data.get("deadline"),
        application_link=data.get("application_link"),
    )
    db.add(scheme)
    await db.commit()
    await db.refresh(scheme)
    return scheme


async def get_scheme(db: AsyncSession, scheme_id: uuid.UUID) -> Optional[GovernmentScheme]:
    """Get a scheme by ID."""
    result = await db.execute(select(GovernmentScheme).filter(GovernmentScheme.id == scheme_id))
    return result.scalars().first()


async def get_all_schemes(db: AsyncSession) -> list[GovernmentScheme]:
    """Get all schemes."""
    result = await db.execute(
        select(GovernmentScheme).order_by(GovernmentScheme.scheme_name)
    )
    return list(result.scalars().all())


async def search_schemes(db: AsyncSession, query: str) -> list[GovernmentScheme]:
    """Search schemes by name or description."""
    result = await db.execute(
        select(GovernmentScheme).filter(
            GovernmentScheme.scheme_name.ilike(f"%{query}%")
            | GovernmentScheme.description.ilike(f"%{query}%")
        )
    )
    return list(result.scalars().all())


async def bulk_upsert_schemes(db: AsyncSession, schemes_list: list[dict]) -> int:
    """
    Bulk upsert schemes — insert new, skip existing (matched by scheme_name).
    Returns count of newly inserted schemes.
    """
    inserted = 0
    for data in schemes_list:
        name = data.get("scheme_name", "").strip()
        if not name:
            continue
        # Check if exists
        result = await db.execute(
            select(GovernmentScheme).filter(GovernmentScheme.scheme_name == name)
        )
        existing = result.scalars().first()
        if existing:
            continue  # Skip existing
        scheme = GovernmentScheme(
            scheme_name=name,
            ministry=data.get("ministry", ""),
            description=data.get("description"),
            eligibility_rules=data.get("eligibility_rules", {}),
            funding_amount=data.get("funding_amount"),
            deadline=data.get("deadline"),
            application_link=data.get("application_link"),
        )
        db.add(scheme)
        inserted += 1

    if inserted > 0:
        await db.commit()
    logger.info(f"Bulk upsert: {inserted} new schemes inserted")
    return inserted


async def seed_schemes_from_file(db: AsyncSession) -> int:
    """
    Seed the database with schemes from the JSON seed file.
    Only inserts if the schemes table is empty.
    """
    # Check if schemes already exist
    result = await db.execute(select(GovernmentScheme).limit(1))
    if result.scalars().first():
        logger.info("Schemes already exist in DB, skipping seed")
        return 0

    if not SEED_FILE.exists():
        logger.warning(f"Seed file not found: {SEED_FILE}")
        return 0

    with open(SEED_FILE, "r", encoding="utf-8") as f:
        schemes_data = json.load(f)

    count = await bulk_upsert_schemes(db, schemes_data)
    logger.info(f"Seeded {count} schemes from file")
    return count


def scheme_to_dict(scheme: GovernmentScheme) -> dict:
    """Convert a GovernmentScheme ORM object to a dict for agent consumption."""
    return {
        "id": str(scheme.id),
        "scheme_name": scheme.scheme_name,
        "ministry": scheme.ministry,
        "description": scheme.description,
        "eligibility_rules": scheme.eligibility_rules or {},
        "funding_amount": scheme.funding_amount,
        "deadline": str(scheme.deadline) if scheme.deadline else None,
        "application_link": scheme.application_link,
    }
