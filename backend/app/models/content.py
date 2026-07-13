from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, Text
from app.models.progress import JSONVariant
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.db.session import Base

class Island(Base):
    __tablename__ = "islands"

    id = Column(String, primary_key=True, index=True) # e.g. 'tutorial_island'
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    difficulty = Column(String, default="Beginner")
    unlock_requirements = Column(JSONVariant, nullable=True) # e.g. {"level": 2}
    content_version = Column(Integer, default=1)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    challenges = relationship("Challenge", back_populates="island", cascade="all, delete-orphan")

class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String, primary_key=True, index=True) # e.g. 'tutorial_01'
    island_id = Column(String, ForeignKey("islands.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(String, default="Beginner")
    sql_concept = Column(String, nullable=True)
    expected_sql = Column(Text, nullable=True)
    validation_type = Column(String, default="EXACT_MATCH")
    hint = Column(Text, nullable=True)
    hint_2 = Column(Text, nullable=True)
    solution = Column(Text, nullable=True)
    database_schema = Column(JSONVariant, nullable=True)
    seed_data = Column(JSONVariant, nullable=True)
    npc = Column(String, nullable=True)
    dialogue_ref = Column(String, nullable=True)
    boss_flag = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    order_index = Column(Integer, default=0)
    
    island = relationship("Island", back_populates="challenges")
    rewards = relationship("Reward", back_populates="challenge", cascade="all, delete-orphan")
    dialogues = relationship("Dialogue", back_populates="challenge", cascade="all, delete-orphan")

class Reward(Base):
    __tablename__ = "rewards"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    xp = Column(Integer, default=0)
    coins = Column(Integer, default=0)
    diamonds = Column(Integer, default=0)
    items = Column(JSONVariant, nullable=True)
    achievement = Column(String, nullable=True)
    key_codex_fragment = Column(String, nullable=True)
    unlock_ship_ability = Column(String, nullable=True)
    unlock_cosmetic = Column(String, nullable=True)

    challenge = relationship("Challenge", back_populates="rewards")

class Dialogue(Base):
    __tablename__ = "dialogues"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    npc_id = Column(String, nullable=False)
    dialogue_text = Column(JSONVariant, nullable=False) # Array of text strings
    branches = Column(JSONVariant, nullable=True)
    conditions = Column(JSONVariant, nullable=True)
    story_events = Column(JSONVariant, nullable=True)
    
    challenge = relationship("Challenge", back_populates="dialogues")

class Media(Base):
    __tablename__ = "media"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    media_type = Column(String, nullable=False) # IMAGE, AUDIO, PORTRAIT, ARTWORK
    created_at = Column(DateTime, default=datetime.utcnow)
