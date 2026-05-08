import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, text, ForeignKey, Integer, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database.base import Base

class Startup(Base):
    __tablename__ = "startups"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    startup_name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(255), nullable=True)
    stage: Mapped[str] = mapped_column(String(100), nullable=True)
    team_size: Mapped[int] = mapped_column(Integer, default=1)
    revenue: Mapped[float] = mapped_column(Float, default=0.0)
    location: Mapped[str] = mapped_column(String(255), nullable=True)
    business_idea: Mapped[str] = mapped_column(text, nullable=True)
    
    # JSONB columns for flexible data
    documents: Mapped[dict] = mapped_column(JSONB, default={}, server_default=text("'{}'::jsonb"))
    metrics: Mapped[dict] = mapped_column(JSONB, default={}, server_default=text("'{}'::jsonb"))
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()")
    )

    # Relationships
    owner = relationship("User", back_populates="startups")
    applications = relationship("Application", back_populates="startup", cascade="all, delete-orphan")
    ai_results = relationship("AIResult", back_populates="startup", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Startup(name={self.startup_name}, owner_id={self.user_id})>"
