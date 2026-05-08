import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database.base import Base

class GovernmentScheme(Base):
    __tablename__ = "government_schemes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()")
    )
    scheme_name: Mapped[str] = mapped_column(String(512), nullable=False)
    ministry: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(text, nullable=True)
    
    # Eligibility rules as JSONB for dynamic checking
    eligibility_rules: Mapped[dict] = mapped_column(JSONB, default={}, server_default=text("'{}'::jsonb"))
    
    funding_amount: Mapped[float] = mapped_column(Float, nullable=True)
    deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    application_link: Mapped[str] = mapped_column(String(512), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()")
    )

    # Relationships
    applications = relationship("Application", back_populates="scheme")
    ai_results = relationship("AIResult", back_populates="scheme")

    def __repr__(self) -> str:
        return f"<GovernmentScheme(name={self.scheme_name}, ministry={self.ministry})>"
