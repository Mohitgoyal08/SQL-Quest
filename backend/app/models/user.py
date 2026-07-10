import uuid
from sqlalchemy import Column, String, Enum
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base
import enum

class UserRole(str, enum.Enum):
    PLAYER = "PLAYER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.PLAYER, nullable=False)

class PlayerProfile(Base):
    __tablename__ = "player_profiles"

    user_id = Column(UUID(as_uuid=True), primary_key=True)
    display_name = Column(String, nullable=False)
    avatar_id = Column(String, nullable=False)
