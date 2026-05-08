"""
AI Service — Orchestrates the full AI pipeline.
Bridges API endpoints with the Master Agent and stores results.
"""
import uuid
import json
import logging
from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.master_agent import MasterAgent
from app.models.ai_result import AIResult
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


async def run_full_analysis(
    db: AsyncSession,
    startup_id: uuid.UUID,
    user_input: str = "",
) -> dict:
    """
    Run the full multi-agent analysis pipeline.
    
    1. Loads startup profile from DB
    2. Loads schemes from DB
    3. Loads existing applications from DB
    4. Invokes Master Agent orchestration
    5. Stores results in ai_results table
    6. Returns the final response
    """
    # Load startup
    result = await db.execute(select(Startup).filter(Startup.id == startup_id))
    startup = result.scalars().first()
    if not startup:
        return {"error": f"Startup {startup_id} not found"}

    startup_profile = startup_to_dict(startup)

    # Load schemes from DB
    schemes_result = await db.execute(select(GovernmentScheme))
    schemes = [scheme_to_dict(s) for s in schemes_result.scalars().all()]

    # Load existing applications
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

    # Run Master Agent
    master = _get_master_agent()
    task_input = {
        "user_input": user_input or "Perform a complete analysis of my startup for government funding opportunities",
        "startup_profile": startup_profile,
        "schemes": schemes,
        "applications": applications,
    }

    response = await master.safe_execute(task_input)

    # Store result in DB
    ai_result = AIResult(
        startup_id=startup_id,
        agent_type="full_analysis",
        result=response.get("data", response) if isinstance(response, dict) else response,
    )
    db.add(ai_result)
    await db.commit()
    await db.refresh(ai_result)

    return {
        "ai_result_id": str(ai_result.id),
        "status": response.get("status", "completed"),
        "data": response.get("data", response),
    }


async def run_scheme_discovery(db: AsyncSession, startup_id: uuid.UUID) -> dict:
    """Run only the scheme discovery + eligibility pipeline."""
    return await _run_targeted_analysis(db, startup_id, "Find relevant government schemes and check eligibility")


async def run_strategy_generation(db: AsyncSession, startup_id: uuid.UUID) -> dict:
    """Run only the strategy generation pipeline."""
    return await _run_targeted_analysis(db, startup_id, "Generate a funding strategy and roadmap")


async def run_document_generation(db: AsyncSession, startup_id: uuid.UUID) -> dict:
    """Run only the document generation pipeline."""
    return await _run_targeted_analysis(db, startup_id, "Generate pitch documents and application checklists")


async def run_monitoring_check(db: AsyncSession, startup_id: uuid.UUID) -> dict:
    """Run only the monitoring/deadline check pipeline."""
    return await _run_targeted_analysis(db, startup_id, "Check deadlines and application status")


async def _run_targeted_analysis(
    db: AsyncSession, startup_id: uuid.UUID, user_input: str
) -> dict:
    """Helper to run a targeted (non-full) analysis."""
    return await run_full_analysis(db, startup_id, user_input)


async def get_ai_results(
    db: AsyncSession,
    startup_id: uuid.UUID,
    agent_type: Optional[str] = None,
) -> list[dict]:
    """Retrieve past AI results for a startup."""
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
            "created_at": str(r.created_at),
        })
    return results
