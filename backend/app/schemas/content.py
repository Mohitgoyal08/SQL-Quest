from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Island Schemas
class IslandBase(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    order_index: int = 0
    difficulty: str = "Beginner"
    unlock_requirements: Optional[Dict[str, Any]] = None

class IslandCreate(IslandBase):
    pass

class IslandUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    order_index: Optional[int] = None
    difficulty: Optional[str] = None
    unlock_requirements: Optional[Dict[str, Any]] = None

class IslandResponse(IslandBase):
    content_version: int
    last_updated: datetime

    class Config:
        from_attributes = True

# Challenge Schemas
class ChallengeBase(BaseModel):
    id: str
    island_id: str
    title: str
    description: Optional[str] = None
    difficulty: str = "Beginner"
    sql_concept: Optional[str] = None
    expected_sql: Optional[str] = None
    validation_type: str = "EXACT_MATCH"
    hint: Optional[str] = None
    solution: Optional[str] = None
    database_schema: Optional[Dict[str, Any]] = None
    seed_data: Optional[Dict[str, Any]] = None
    npc: Optional[str] = None
    dialogue_ref: Optional[str] = None
    boss_flag: bool = False
    is_active: bool = True
    order_index: int = 0
    hint_2: Optional[str] = None

class ChallengeCreate(ChallengeBase):
    pass

class ChallengeUpdate(BaseModel):
    island_id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    sql_concept: Optional[str] = None
    expected_sql: Optional[str] = None
    validation_type: Optional[str] = None
    hint: Optional[str] = None
    solution: Optional[str] = None
    database_schema: Optional[Dict[str, Any]] = None
    seed_data: Optional[Dict[str, Any]] = None
    npc: Optional[str] = None
    dialogue_ref: Optional[str] = None
    boss_flag: Optional[bool] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None
    hint_2: Optional[str] = None

class ChallengeResponse(ChallengeBase):
    class Config:
        from_attributes = True

# Reward Schemas
class RewardBase(BaseModel):
    challenge_id: str
    xp: int = 0
    coins: int = 0
    diamonds: int = 0
    items: Optional[Dict[str, Any]] = None
    achievement: Optional[str] = None
    key_codex_fragment: Optional[str] = None
    unlock_ship_ability: Optional[str] = None
    unlock_cosmetic: Optional[str] = None

class RewardCreate(RewardBase):
    pass

class RewardUpdate(BaseModel):
    xp: Optional[int] = None
    coins: Optional[int] = None
    diamonds: Optional[int] = None
    items: Optional[Dict[str, Any]] = None
    achievement: Optional[str] = None
    key_codex_fragment: Optional[str] = None
    unlock_ship_ability: Optional[str] = None
    unlock_cosmetic: Optional[str] = None

class RewardResponse(RewardBase):
    id: str

    class Config:
        from_attributes = True

# Dialogue Schemas
class DialogueBase(BaseModel):
    challenge_id: str
    npc_id: str
    dialogue_text: List[str]
    branches: Optional[Dict[str, Any]] = None
    conditions: Optional[Dict[str, Any]] = None
    story_events: Optional[Dict[str, Any]] = None

class DialogueCreate(DialogueBase):
    pass

class DialogueUpdate(BaseModel):
    npc_id: Optional[str] = None
    dialogue_text: Optional[List[str]] = None
    branches: Optional[Dict[str, Any]] = None
    conditions: Optional[Dict[str, Any]] = None
    story_events: Optional[Dict[str, Any]] = None

class DialogueResponse(DialogueBase):
    id: str

    class Config:
        from_attributes = True

# Media Schemas
class MediaBase(BaseModel):
    filename: str
    file_url: str
    media_type: str

class MediaCreate(MediaBase):
    pass

class MediaResponse(MediaBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
