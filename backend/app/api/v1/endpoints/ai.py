"""
AI Orchestration endpoints — the core of the multi-agent system.

Endpoint design:
  GET  /ai/latest/{startup_id}  → returns cached result instantly (no AI call)
  POST /ai/analyze              → runs AI (uses cache unless force=True or profile changed)
  POST /ai/refresh/{startup_id} → forces AI rerun regardless of cache
  GET  /ai/results/{startup_id} → full history list
"""
from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services import ai_service, startup_service

router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    startup_id: UUID
    user_input: Optional[str] = ""
    force: Optional[bool] = False  # True = bypass cache, always rerun


class AIResponse(BaseModel):
    ai_result_id: str
    status: str
    data: dict

    class Config:
        extra = "allow"


# ── Helpers ───────────────────────────────────────────────────────────────────

async def _get_owned_startup(db, startup_id, current_user):
    startup = await startup_service.get_startup(db, startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return startup


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/latest/{startup_id}")
async def get_latest(
    startup_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    GET /ai/latest/{startup_id}

    Returns the latest cached AI result instantly — NO Gemini call.
    Includes staleness metadata so the frontend can decide if a refresh is needed.

    Response meta fields:
      - from_cache: always True
      - is_stale: True if result > 24h old
      - profile_changed: True if startup profile was edited since last analysis
      - age: human-readable age string ("2 hours ago")
      - confidence_score: validation agent confidence (0.0-1.0)
    """
    startup = await _get_owned_startup(db, startup_id, current_user)
    startup_profile = startup_service.startup_to_dict(startup)

    result = await ai_service.get_latest_result_for_api(db, startup_id, startup_profile)
    if not result:
        return {"status": "no_analysis", "data": {}, "meta": {"from_cache": False}}
    return result


@router.post("/analyze", response_model=AIResponse)
async def full_analysis(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    POST /ai/analyze

    Runs the full multi-agent pipeline.
    Uses the cache unless:
      - force=True in request body
      - startup profile has changed since last analysis
      - last analysis is older than 24 hours (stale)
    """
    await _get_owned_startup(db, request.startup_id, current_user)
    result = await ai_service.run_full_analysis(
        db, request.startup_id, request.user_input or "", force=request.force
    )
    return result


@router.post("/refresh/{startup_id}", response_model=AIResponse)
async def force_refresh(
    startup_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    POST /ai/refresh/{startup_id}

    Forces a full AI rerun, bypassing the cache entirely.
    Use this when the user explicitly clicks "Re-analyze".
    """
    await _get_owned_startup(db, startup_id, current_user)
    result = await ai_service.run_full_analysis(
        db, startup_id, "Perform a complete re-analysis of my startup", force=True
    )
    return result


@router.post("/discover-schemes", response_model=AIResponse)
async def discover_schemes(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run scheme discovery + eligibility check only."""
    await _get_owned_startup(db, request.startup_id, current_user)
    return await ai_service.run_scheme_discovery(db, request.startup_id)


@router.post("/strategy", response_model=AIResponse)
async def generate_strategy(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run strategy generation only."""
    await _get_owned_startup(db, request.startup_id, current_user)
    return await ai_service.run_strategy_generation(db, request.startup_id)


@router.post("/documents", response_model=AIResponse)
async def generate_documents(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run document generation only."""
    await _get_owned_startup(db, request.startup_id, current_user)
    return await ai_service.run_document_generation(db, request.startup_id)


@router.post("/monitor", response_model=AIResponse)
async def monitor_applications(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run monitoring check only."""
    await _get_owned_startup(db, request.startup_id, current_user)
    return await ai_service.run_monitoring_check(db, request.startup_id)


@router.get("/results/{startup_id}")
async def get_results(
    startup_id: UUID,
    agent_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    GET /ai/results/{startup_id}

    Get full history of AI results for a startup.
    Each record includes is_latest, is_stale, confidence_score, and age.
    Optionally filter by agent_type.
    """
    await _get_owned_startup(db, startup_id, current_user)
    results = await ai_service.get_ai_results(db, startup_id, agent_type)
    return {"results": results, "count": len(results)}
