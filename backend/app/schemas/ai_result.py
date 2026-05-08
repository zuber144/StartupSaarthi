from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional, Any

class AIResultBase(BaseModel):
    agent_type: str
    result: dict[str, Any]

class AIResultCreate(AIResultBase):
    startup_id: UUID
    scheme_id: Optional[UUID] = None

class AIResultUpdate(BaseModel):
    agent_type: Optional[str] = None
    result: Optional[dict[str, Any]] = None

class AIResultRead(AIResultBase):
    id: UUID
    startup_id: UUID
    scheme_id: Optional[UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
