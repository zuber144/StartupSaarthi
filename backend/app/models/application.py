import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, text, ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database.base import Base

class Application(Base):
    __tablename__ = "applications"

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
        ForeignKey("government_schemes.id", ondelete="CASCADE"), 
        nullable=False
    )
    status: Mapped[str] = mapped_column(String(50), default="pending", index=True)
    approval_probability: Mapped[float] = mapped_column(Float, default=0.0)
    
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()")
    )

    # Relationships
    startup = relationship("Startup", back_populates="applications")
    scheme = relationship("GovernmentScheme", back_populates="applications")

    def __repr__(self) -> str:
        return f"<Application(startup_id={self.startup_id}, scheme_id={self.scheme_id}, status={self.status})>"
