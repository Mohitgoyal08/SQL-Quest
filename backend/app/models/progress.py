import uuid
import enum
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.session import Base

# SQLAlchemy JSON variant to use JSONB in Postgres, and JSON in SQLite
JSONVariant = JSON().with_variant(JSONB, "postgresql")

class ChallengeStatus(str, enum.Enum):
    COMPLETED = "COMPLETED"
    IN_PROGRESS = "IN_PROGRESS"

class PlayerProgress(Base):
    __tablename__ = "player_progress"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    level = Column(Integer, default=1, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    coins = Column(Integer, default=0, nullable=False)
    gems = Column(Integer, default=0, nullable=False)
    current_island = Column(String, default="tutorial", nullable=False)
    current_npc = Column(String, default="captain", nullable=False)
    current_challenge_id = Column(String, default="chal_01", nullable=False)
    inventory = Column(JSONVariant, default=[], nullable=False)
    badges = Column(JSONVariant, default=[], nullable=False)
    unlocked_ids = Column(JSONVariant, default=[], nullable=False)
    unlocks = Column(JSONVariant, default={}, nullable=False)
    fleet = Column(JSONVariant, default={}, nullable=False)
    last_saved_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

class CompletedChallenge(Base):
    __tablename__ = "completed_challenges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    challenge_id = Column(String, index=True, nullable=False)
    status = Column(Enum(ChallengeStatus), default=ChallengeStatus.IN_PROGRESS, nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    event_type = Column(String, index=True, nullable=False)
    event_data = Column(JSONVariant, default={}, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class ChallengeAttempt(Base):
    __tablename__ = "challenge_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    challenge_id = Column(String, index=True, nullable=False)
    success = Column(Boolean, default=False, nullable=False)
    query_submitted = Column(String, nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class PracticeAttempt(Base):
    __tablename__ = "practice_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), index=True, nullable=False)
    schema_used = Column(String, nullable=False)
    query_submitted = Column(String, nullable=True)
    success = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
