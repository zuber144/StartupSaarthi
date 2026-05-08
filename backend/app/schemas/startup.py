from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional, Any

class StartupBase(BaseModel):
    startup_name: str
    domain: Optional[str] = None
    stage: Optional[str] = None
    team_size: Optional[int] = 1
    revenue: Optional[float] = 0.0
    location: Optional[str] = None
    business_idea: Optional[str] = None
    documents: Optional[dict[str, Any]] = {}
    metrics: Optional[dict[str, Any]] = {}

class StartupCreate(StartupBase):
    pass

class StartupUpdate(BaseModel):
    startup_name: Optional[str] = None
    domain: Optional[str] = None
    stage: Optional[str] = None
    team_size: Optional[int] = None
    revenue: Optional[float] = None
    location: Optional[str] = None
    business_idea: Optional[str] = None
    documents: Optional[dict[str, Any]] = None
    metrics: Optional[dict[str, Any]] = None

class StartupRead(StartupBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
