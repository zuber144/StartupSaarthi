from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional

class ApplicationBase(BaseModel):
    status: Optional[str] = "pending"
    approval_probability: Optional[float] = 0.0

class ApplicationCreate(ApplicationBase):
    startup_id: UUID
    scheme_id: UUID

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    approval_probability: Optional[float] = None

class ApplicationRead(ApplicationBase):
    id: UUID
    startup_id: UUID
    scheme_id: UUID
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)
