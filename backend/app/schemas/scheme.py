from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional, Any

class SchemeBase(BaseModel):
    scheme_name: str
    ministry: str
    description: Optional[str] = None
    eligibility_rules: Optional[dict[str, Any]] = {}
    funding_amount: Optional[float] = None
    deadline: Optional[datetime] = None
    application_link: Optional[str] = None

class SchemeCreate(SchemeBase):
    pass

class SchemeUpdate(BaseModel):
    scheme_name: Optional[str] = None
    ministry: Optional[str] = None
    description: Optional[str] = None
    eligibility_rules: Optional[dict[str, Any]] = None
    funding_amount: Optional[float] = None
    deadline: Optional[datetime] = None
    application_link: Optional[str] = None

class SchemeRead(SchemeBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
