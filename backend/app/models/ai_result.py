import uuid
import hashlib
import json
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, text, ForeignKey, Float, Boolean, Integer
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
        nullable=False,
        index=True
    )
    scheme_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("government_schemes.id", ondelete="SET NULL"),
        nullable=True
    )

    # Agent types: full_analysis, research_eligibility, strategy, document, monitoring
    agent_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)

    # JSONB for storing flexible agent outputs
    result: Mapped[dict] = mapped_column(JSONB, default={}, server_default=text("'{}'::jsonb"))

    # ── Persistence & Freshness Metadata ─────────────────────────────────────
    # Hash of the startup profile at the time of analysis.
    # If the current profile hash differs, the result is considered stale.
    profile_hash: Mapped[str] = mapped_column(String(64), nullable=True, index=True)

    # Confidence score extracted from the Validation Agent (0.0 – 1.0)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=True)

    # Number of hours before this result is considered stale (default: 24h)
    stale_after_hours: Mapped[int] = mapped_column(Integer, default=24, server_default="24")

    # Marks the single latest result per startup (for fast lookups)
    is_latest: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true", index=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        server_default=text("now()")
    )

    # Relationships
    startup = relationship("Startup", back_populates="ai_results")
    scheme = relationship("GovernmentScheme", back_populates="ai_results")

    # ── Helper Properties ─────────────────────────────────────────────────────
    @property
    def is_stale(self) -> bool:
        """Returns True if this result is older than stale_after_hours."""
        now = datetime.now(timezone.utc)
        age_hours = (now - self.created_at).total_seconds() / 3600
        return age_hours > (self.stale_after_hours or 24)

    @property
    def age_human(self) -> str:
        """Returns a human-readable age string like '2 hours ago'."""
        now = datetime.now(timezone.utc)
        diff = now - self.created_at
        seconds = int(diff.total_seconds())
        if seconds < 60:
            return "just now"
        if seconds < 3600:
            mins = seconds // 60
            return f"{mins} minute{'s' if mins > 1 else ''} ago"
        if seconds < 86400:
            hrs = seconds // 3600
            return f"{hrs} hour{'s' if hrs > 1 else ''} ago"
        days = seconds // 86400
        return f"{days} day{'s' if days > 1 else ''} ago"

    def __repr__(self) -> str:
        return f"<AIResult(agent={self.agent_type}, startup_id={self.startup_id}, stale={self.is_stale})>"


def compute_profile_hash(startup_dict: dict) -> str:
    """
    Deterministically hash the key fields of a startup profile.
    If any of these fields change, the hash changes → result is stale.
    """
    key_fields = {
        "startup_name": startup_dict.get("startup_name", ""),
        "domain": startup_dict.get("domain", ""),
        "stage": startup_dict.get("stage", ""),
        "location": startup_dict.get("location", ""),
        "business_idea": startup_dict.get("business_idea", ""),
        "team_size": startup_dict.get("team_size", 1),
        "revenue": startup_dict.get("revenue", 0),
    }
    serialized = json.dumps(key_fields, sort_keys=True)
    return hashlib.sha256(serialized.encode()).hexdigest()
