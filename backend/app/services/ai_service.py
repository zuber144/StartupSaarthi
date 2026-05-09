"""
AI Service — Orchestrates the full AI pipeline.
Bridges API endpoints with the Master Agent and stores results.

Persistence architecture:
- Every analysis is persisted as an AIResult row.
- Only one row per startup has is_latest=True.
- profile_hash detects when startup profile changed → result stale.
- confidence_score is extracted from ValidationAgent output.
"""
import uuid
import json
import logging
from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.master_agent import MasterAgent
from app.models.ai_result import AIResult, compute_profile_hash
from app.models.startup import Startup
from app.models.application import Application
from app.models.scheme import GovernmentScheme
from app.services.startup_service import startup_to_dict
from app.services.scheme_service import scheme_to_dict

logger = logging.getLogger(__name__)

# Singleton master agent (reusable across requests)
_master_agent: Optional[MasterAgent] = None


def _get_master_agent() -> MasterAgent:
    """Get or create the master agent singleton."""
    global _master_agent
    if _master_agent is None:
        _master_agent = MasterAgent()
    return _master_agent


# ── Freshness / Cache Layer ────────────────────────────────────────────────────

async def get_latest_result(
    db: AsyncSession,
    startup_id: uuid.UUID,
) -> Optional[AIResult]:
    """
    Fetch the most recent AIResult for a startup.
    Returns None if no analysis has ever been run.
    """
    query = (
        select(AIResult)
        .filter(AIResult.startup_id == startup_id, AIResult.is_latest == True)
        .order_by(AIResult.created_at.desc())
        .limit(1)
    )
    result = await db.execute(query)
    return result.scalars().first()


async def _mark_previous_not_latest(db: AsyncSession, startup_id: uuid.UUID) -> None:
    """
    Clear is_latest=True from all previous results for this startup.
    Called before inserting a new latest result.
    """
    await db.execute(
        update(AIResult)
        .where(AIResult.startup_id == startup_id)
        .values(is_latest=False)
    )


def _extract_confidence(response: dict) -> Optional[float]:
    """
    Extract confidence score from validation agent output.
    Looks in multiple possible keys with graceful fallback.
    """
    data = response.get("data", response) if isinstance(response, dict) else {}
    if isinstance(data, dict):
        # Try nested validation key first
        validation = data.get("validation", {})
        if isinstance(validation, dict):
            score = validation.get("confidence_score") or validation.get("confidence")
            if score is not None:
                try:
                    return float(score)
                except (ValueError, TypeError):
                    pass
        # Try top-level
        score = data.get("confidence_score") or data.get("confidence")
        if score is not None:
            try:
                return float(score)
            except (ValueError, TypeError):
                pass
    return None


# ── Core Analysis Pipeline ─────────────────────────────────────────────────────

async def run_full_analysis(
    db: AsyncSession,
    startup_id: uuid.UUID,
    user_input: str = "",
    force: bool = False,
) -> dict:
    """
    Run the full multi-agent analysis pipeline.

    Caching logic:
    1. Compute current profile hash.
    2. Fetch latest cached result.
    3. If cached result exists AND profile hash matches AND result is not stale
       AND force=False → return cached result (no Gemini call).
    4. Otherwise → invoke Master Agent, persist new result, mark old as non-latest.
    """
    # Load startup
    result = await db.execute(select(Startup).filter(Startup.id == startup_id))
    startup = result.scalars().first()
    if not startup:
        return {"error": f"Startup {startup_id} not found"}

    startup_profile = startup_to_dict(startup)
    current_hash = compute_profile_hash(startup_profile)

    # ── Cache Check ──────────────────────────────────────────────────────────
    if not force:
        cached = await get_latest_result(db, startup_id)
        if cached and cached.profile_hash == current_hash and not cached.is_stale:
            logger.info(f"Cache HIT for startup {startup_id} (age: {cached.age_human})")
            return _format_cached_response(cached)

    logger.info(f"Cache MISS for startup {startup_id} — running full analysis...")

    # ── Load context data ────────────────────────────────────────────────────
    schemes_result = await db.execute(select(GovernmentScheme))
    schemes = [scheme_to_dict(s) for s in schemes_result.scalars().all()]

    apps_result = await db.execute(
        select(Application).filter(Application.startup_id == startup_id)
    )
    applications = []
    for app in apps_result.scalars().all():
        applications.append({
            "id": str(app.id),
            "scheme_id": str(app.scheme_id),
            "status": app.status,
            "approval_probability": app.approval_probability,
            "submitted_at": str(app.submitted_at),
        })

    # ── Run Master Agent ─────────────────────────────────────────────────────
    master = _get_master_agent()
    task_input = {
        "user_input": user_input or "Perform a complete analysis of my startup for government funding opportunities",
        "startup_profile": startup_profile,
        "schemes": schemes,
        "applications": applications,
    }

    response = await master.safe_execute(task_input)
    confidence = _extract_confidence(response)

    # ── Persist: mark old result as non-latest ───────────────────────────────
    await _mark_previous_not_latest(db, startup_id)

    # ── Persist: create new latest result ───────────────────────────────────
    ai_result = AIResult(
        startup_id=startup_id,
        agent_type="full_analysis",
        result=response.get("data", response) if isinstance(response, dict) else response,
        profile_hash=current_hash,
        confidence_score=confidence,
        stale_after_hours=24,
        is_latest=True,
    )
    db.add(ai_result)
    await db.commit()
    await db.refresh(ai_result)

    return {
        "ai_result_id": str(ai_result.id),
        "status": response.get("status", "completed"),
        "contract_version": response.get("contract_version", "1.0"),
        "data": response.get("data", response) if isinstance(response, dict) else response,
        "meta": {
            "analyzed_at": ai_result.created_at.isoformat(),
            "age": ai_result.age_human,
            "confidence_score": confidence,
            "profile_hash": current_hash,
            "is_fresh": True,
            "is_stale": False,
            "from_cache": False,
        }
    }


def _format_cached_response(cached: AIResult) -> dict:
    """Format a cached AIResult into the standard API response shape."""
    return {
        "ai_result_id": str(cached.id),
        "status": "completed",
        "contract_version": cached.result.get("contract_version", "1.0") if isinstance(cached.result, dict) else "1.0",
        "data": cached.result,
        "meta": {
            "analyzed_at": cached.created_at.isoformat(),
            "age": cached.age_human,
            "confidence_score": cached.confidence_score,
            "profile_hash": cached.profile_hash,
            "is_fresh": not cached.is_stale,
            "is_stale": cached.is_stale,
            "from_cache": True,
        }
    }


# ── Targeted Analysis Variants ────────────────────────────────────────────────

async def run_scheme_discovery(db: AsyncSession, startup_id: uuid.UUID) -> dict:
    return await run_full_analysis(db, startup_id, "Find relevant government schemes and check eligibility", force=True)


async def run_strategy_generation(db: AsyncSession, startup_id: uuid.UUID) -> dict:
    return await run_full_analysis(db, startup_id, "Generate a funding strategy and roadmap", force=True)


async def run_document_generation(db: AsyncSession, startup_id: uuid.UUID) -> dict:
    return await run_full_analysis(db, startup_id, "Generate pitch documents and application checklists", force=True)


async def run_monitoring_check(db: AsyncSession, startup_id: uuid.UUID) -> dict:
    return await run_full_analysis(db, startup_id, "Check deadlines and application status", force=True)


# ── History Retrieval ─────────────────────────────────────────────────────────

async def get_ai_results(
    db: AsyncSession,
    startup_id: uuid.UUID,
    agent_type: Optional[str] = None,
) -> list[dict]:
    """Retrieve all past AI results for a startup (history), newest first."""
    query = select(AIResult).filter(AIResult.startup_id == startup_id)
    if agent_type:
        query = query.filter(AIResult.agent_type == agent_type)
    query = query.order_by(AIResult.created_at.desc())

    result = await db.execute(query)
    results = []
    for r in result.scalars().all():
        results.append({
            "id": str(r.id),
            "agent_type": r.agent_type,
            "result": r.result,
            "is_latest": r.is_latest,
            "is_stale": r.is_stale,
            "confidence_score": r.confidence_score,
            "profile_hash": r.profile_hash,
            "age": r.age_human,
            "created_at": r.created_at.isoformat(),
        })
    return results


async def get_latest_result_for_api(
    db: AsyncSession,
    startup_id: uuid.UUID,
    startup_profile: dict,
) -> Optional[dict]:
    """
    Get the latest cached result and enrich it with staleness info.
    Used by the GET /ai/latest endpoint (no AI call).
    """
    cached = await get_latest_result(db, startup_id)
    if not cached:
        return None

    current_hash = compute_profile_hash(startup_profile)
    profile_changed = cached.profile_hash != current_hash

    return {
        "ai_result_id": str(cached.id),
        "status": "completed",
        "data": cached.result,
        "meta": {
            "analyzed_at": cached.created_at.isoformat(),
            "age": cached.age_human,
            "confidence_score": cached.confidence_score,
            "profile_hash": cached.profile_hash,
            "is_fresh": not cached.is_stale and not profile_changed,
            "is_stale": cached.is_stale,
            "profile_changed": profile_changed,
            "from_cache": True,
        }
    }
