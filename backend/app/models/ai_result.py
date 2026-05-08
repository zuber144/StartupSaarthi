import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database.base import Base

class AIResult(Base):
    __tablename__ = "ai_results"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()")
    )
    startup_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("startups.id", ondelete="CASCADE"), 
        nullable=False
    )
    scheme_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("government_schemes.id", ondelete="SET NULL"), 
        nullable=True
    )
    
    # Agent types: research, eligibility, strategy, document, monitoring
    agent_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    
    # JSONB for storing flexible agent outputs
    result: Mapped[dict] = mapped_column(JSONB, default={}, server_default=text("'{}'::jsonb"))
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()")
    )

    # Relationships
    startup = relationship("Startup", back_populates="ai_results")
    scheme = relationship("GovernmentScheme", back_populates="ai_results")

    def __repr__(self) -> str:
        return f"<AIResult(agent={self.agent_type}, startup_id={self.startup_id})>"
