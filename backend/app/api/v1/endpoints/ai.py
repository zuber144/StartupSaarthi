"""
AI Orchestration endpoints — the core of the multi-agent system.
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


# ------------------------------------------------------------------ #
#  Request / Response Schemas
# ------------------------------------------------------------------ #

class AnalyzeRequest(BaseModel):
    startup_id: UUID
    user_input: Optional[str] = ""


class AIResponse(BaseModel):
    ai_result_id: str
    status: str
    data: dict

    class Config:
        extra = "allow"


# ------------------------------------------------------------------ #
#  Endpoints
# ------------------------------------------------------------------ #

@router.post("/analyze", response_model=AIResponse)
async def full_analysis(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Run full multi-agent analysis.
    Triggers: Research+Eligibility → Strategy → Document → Monitoring → Validation.
    
    This is the primary endpoint for the AI system.
    """
    # Verify ownership
    startup = await startup_service.get_startup(db, request.startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await ai_service.run_full_analysis(
        db, request.startup_id, request.user_input
    )
    return result


@router.post("/discover-schemes", response_model=AIResponse)
async def discover_schemes(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run scheme discovery + eligibility check only."""
    startup = await startup_service.get_startup(db, request.startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await ai_service.run_scheme_discovery(db, request.startup_id)
    return result


@router.post("/strategy", response_model=AIResponse)
async def generate_strategy(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run strategy generation only."""
    startup = await startup_service.get_startup(db, request.startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await ai_service.run_strategy_generation(db, request.startup_id)
    return result


@router.post("/documents", response_model=AIResponse)
async def generate_documents(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run document generation only."""
    startup = await startup_service.get_startup(db, request.startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await ai_service.run_document_generation(db, request.startup_id)
    return result


@router.post("/monitor", response_model=AIResponse)
async def monitor_applications(
    request: AnalyzeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run monitoring check only."""
    startup = await startup_service.get_startup(db, request.startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    result = await ai_service.run_monitoring_check(db, request.startup_id)
    return result


@router.get("/results/{startup_id}")
async def get_results(
    startup_id: UUID,
    agent_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get past AI results for a startup.
    Optionally filter by agent_type: full_analysis, research_eligibility, strategy, document, monitoring.
    """
    startup = await startup_service.get_startup(db, startup_id)
    if not startup:
        raise HTTPException(status_code=404, detail="Startup not found")
    if startup.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    results = await ai_service.get_ai_results(db, startup_id, agent_type)
    return {"results": results, "count": len(results)}
