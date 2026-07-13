from sqlalchemy.orm import Session
from app.models.content import Island, Challenge, Reward, Dialogue, Media
from app.schemas.content import (
    IslandCreate, IslandUpdate,
    ChallengeCreate, ChallengeUpdate,
    RewardCreate, RewardUpdate,
    DialogueCreate, DialogueUpdate,
    MediaCreate
)
from typing import List, Optional

# --- ISLANDS ---
def get_islands(db: Session, skip: int = 0, limit: int = 100) -> List[Island]:
    return db.query(Island).order_by(Island.order_index).offset(skip).limit(limit).all()

def get_island(db: Session, island_id: str) -> Optional[Island]:
    return db.query(Island).filter(Island.id == island_id).first()

def create_island(db: Session, island: IslandCreate) -> Island:
    db_island = Island(**island.model_dump())
    db.add(db_island)
    db.commit()
    db.refresh(db_island)
    return db_island

def update_island(db: Session, island_id: str, island: IslandUpdate) -> Optional[Island]:
    db_island = get_island(db, island_id)
    if db_island:
        update_data = island.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_island, key, value)
        db_island.content_version += 1
        db.commit()
        db.refresh(db_island)
    return db_island

def delete_island(db: Session, island_id: str) -> bool:
    db_island = get_island(db, island_id)
    if db_island:
        db.delete(db_island)
        db.commit()
        return True
    return False

# --- CHALLENGES ---
def get_challenges(db: Session, island_id: Optional[str] = None, skip: int = 0, limit: int = 100) -> List[Challenge]:
    query = db.query(Challenge)
    if island_id:
        query = query.filter(Challenge.island_id == island_id)
    return query.offset(skip).limit(limit).all()

def get_challenge(db: Session, challenge_id: str) -> Optional[Challenge]:
    return db.query(Challenge).filter(Challenge.id == challenge_id).first()

def create_challenge(db: Session, challenge: ChallengeCreate) -> Challenge:
    db_challenge = Challenge(**challenge.model_dump())
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    return db_challenge

def update_challenge(db: Session, challenge_id: str, challenge: ChallengeUpdate) -> Optional[Challenge]:
    db_challenge = get_challenge(db, challenge_id)
    if db_challenge:
        update_data = challenge.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_challenge, key, value)
        db.commit()
        db.refresh(db_challenge)
    return db_challenge

def delete_challenge(db: Session, challenge_id: str) -> bool:
    db_challenge = get_challenge(db, challenge_id)
    if db_challenge:
        db.delete(db_challenge)
        db.commit()
        return True
    return False

# --- REWARDS ---
def get_rewards(db: Session, challenge_id: str) -> List[Reward]:
    return db.query(Reward).filter(Reward.challenge_id == challenge_id).all()

def create_reward(db: Session, reward: RewardCreate) -> Reward:
    db_reward = Reward(**reward.model_dump())
    db.add(db_reward)
    db.commit()
    db.refresh(db_reward)
    return db_reward

def update_reward(db: Session, reward_id: str, reward: RewardUpdate) -> Optional[Reward]:
    db_reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if db_reward:
        update_data = reward.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_reward, key, value)
        db.commit()
        db.refresh(db_reward)
    return db_reward

def delete_reward(db: Session, reward_id: str) -> bool:
    db_reward = db.query(Reward).filter(Reward.id == reward_id).first()
    if db_reward:
        db.delete(db_reward)
        db.commit()
        return True
    return False

# --- DIALOGUES ---
def get_dialogues(db: Session, challenge_id: str) -> List[Dialogue]:
    return db.query(Dialogue).filter(Dialogue.challenge_id == challenge_id).all()

def create_dialogue(db: Session, dialogue: DialogueCreate) -> Dialogue:
    db_dialogue = Dialogue(**dialogue.model_dump())
    db.add(db_dialogue)
    db.commit()
    db.refresh(db_dialogue)
    return db_dialogue

def update_dialogue(db: Session, dialogue_id: str, dialogue: DialogueUpdate) -> Optional[Dialogue]:
    db_dialogue = db.query(Dialogue).filter(Dialogue.id == dialogue_id).first()
    if db_dialogue:
        update_data = dialogue.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_dialogue, key, value)
        db.commit()
        db.refresh(db_dialogue)
    return db_dialogue

def delete_dialogue(db: Session, dialogue_id: str) -> bool:
    db_dialogue = db.query(Dialogue).filter(Dialogue.id == dialogue_id).first()
    if db_dialogue:
        db.delete(db_dialogue)
        db.commit()
        return True
    return False

# --- MEDIA ---
def get_media(db: Session, skip: int = 0, limit: int = 100) -> List[Media]:
    return db.query(Media).offset(skip).limit(limit).all()

def create_media(db: Session, media: MediaCreate) -> Media:
    db_media = Media(**media.model_dump())
    db.add(db_media)
    db.commit()
    db.refresh(db_media)
    return db_media

def delete_media(db: Session, media_id: str) -> bool:
    db_media = db.query(Media).filter(Media.id == media_id).first()
    if db_media:
        db.delete(db_media)
        db.commit()
        return True
    return False
