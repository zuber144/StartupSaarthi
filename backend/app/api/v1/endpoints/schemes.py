"""
Government Scheme endpoints.
"""
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.database.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.scheme import SchemeRead
from app.services import scheme_service

router = APIRouter()


@router.get("/", response_model=list[SchemeRead])
async def list_schemes(
    query: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    List all government schemes.
    Optionally filter by search query (matches name and description).
    Public endpoint — no auth required.
    """
    if query:
        return await scheme_service.search_schemes(db, query)
    return await scheme_service.get_all_schemes(db)


@router.get("/{scheme_id}", response_model=SchemeRead)
async def get_scheme(
    scheme_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get a specific scheme by ID. Public endpoint."""
    scheme = await scheme_service.get_scheme(db, scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@router.post("/refresh")
async def refresh_schemes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Trigger a scheme database refresh.
    Scrapes government websites and updates the schemes table.
    Requires authentication.
    """
    from app.scraping.scraper import SchemeScraper
    from app.scraping.sources import SCHEME_SOURCES
    from app.agents.research_eligibility_agent import ResearchEligibilityAgent

    scraper = SchemeScraper()
    agent = ResearchEligibilityAgent()
    total_new = 0

    for source_key, source_info in SCHEME_SOURCES.items():
        source_name = source_info["name"]
        for url in source_info["pages"]:
            # Scrape the page
            text = await scraper.scrape_and_extract(url)
            if not text:
                continue

            # Use Gemini to structure the data
            structured = await agent.scrape_and_structure_schemes(text, source_name)
            if not structured:
                continue

            # Upsert into DB
            count = await scheme_service.bulk_upsert_schemes(db, structured)
            total_new += count

    return {
        "message": f"Scheme refresh complete. {total_new} new schemes added.",
        "new_schemes_count": total_new,
    }


@router.post("/seed")
async def seed_schemes(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Seed schemes from the bundled JSON file. Requires authentication."""
    count = await scheme_service.seed_schemes_from_file(db)
    return {
        "message": f"Seeded {count} schemes.",
        "count": count,
    }
