from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
import uuid

from app.api import deps
from app.crud import crud_content
from app.schemas.content import (
    IslandCreate, IslandUpdate, IslandResponse,
    ChallengeCreate, ChallengeUpdate, ChallengeResponse,
    RewardCreate, RewardUpdate, RewardResponse,
    DialogueCreate, DialogueUpdate, DialogueResponse,
    MediaCreate, MediaResponse
)
from app.models.user import User

router = APIRouter()

# --- ISLANDS ---
@router.get("/islands", response_model=List[IslandResponse])
def read_islands(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    return crud_content.get_islands(db, skip=skip, limit=limit)

@router.post("/islands", response_model=IslandResponse)
def create_island(
    *,
    db: Session = Depends(deps.get_db),
    island_in: IslandCreate,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    island = crud_content.get_island(db, island_id=island_in.id)
    if island:
        raise HTTPException(
            status_code=400,
            detail="The island with this ID already exists in the system.",
        )
    return crud_content.create_island(db=db, island=island_in)

@router.put("/islands/{island_id}", response_model=IslandResponse)
def update_island(
    *,
    db: Session = Depends(deps.get_db),
    island_id: str,
    island_in: IslandUpdate,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    island = crud_content.update_island(db, island_id=island_id, island=island_in)
    if not island:
        raise HTTPException(status_code=404, detail="Island not found")
    return island

@router.delete("/islands/{island_id}", response_model=dict)
def delete_island(
    *,
    db: Session = Depends(deps.get_db),
    island_id: str,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    success = crud_content.delete_island(db, island_id=island_id)
    if not success:
        raise HTTPException(status_code=404, detail="Island not found")
    return {"status": "success"}

# --- CHALLENGES ---
@router.get("/challenges", response_model=List[ChallengeResponse])
def read_challenges(
    island_id: str = None,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    return crud_content.get_challenges(db, island_id=island_id, skip=skip, limit=limit)

@router.post("/challenges", response_model=ChallengeResponse)
def create_challenge(
    *,
    db: Session = Depends(deps.get_db),
    challenge_in: ChallengeCreate,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    challenge = crud_content.get_challenge(db, challenge_id=challenge_in.id)
    if challenge:
        raise HTTPException(
            status_code=400,
            detail="The challenge with this ID already exists in the system.",
        )
    return crud_content.create_challenge(db=db, challenge=challenge_in)

@router.put("/challenges/{challenge_id}", response_model=ChallengeResponse)
def update_challenge(
    *,
    db: Session = Depends(deps.get_db),
    challenge_id: str,
    challenge_in: ChallengeUpdate,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    challenge = crud_content.update_challenge(db, challenge_id=challenge_id, challenge=challenge_in)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge

@router.delete("/challenges/{challenge_id}", response_model=dict)
def delete_challenge(
    *,
    db: Session = Depends(deps.get_db),
    challenge_id: str,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    success = crud_content.delete_challenge(db, challenge_id=challenge_id)
    if not success:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return {"status": "success"}

# --- REWARDS ---
@router.get("/rewards/{challenge_id}", response_model=List[RewardResponse])
def read_rewards(
    challenge_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    return crud_content.get_rewards(db, challenge_id=challenge_id)

@router.post("/rewards", response_model=RewardResponse)
def create_reward(
    *,
    db: Session = Depends(deps.get_db),
    reward_in: RewardCreate,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    return crud_content.create_reward(db=db, reward=reward_in)

@router.put("/rewards/{reward_id}", response_model=RewardResponse)
def update_reward(
    *,
    db: Session = Depends(deps.get_db),
    reward_id: str,
    reward_in: RewardUpdate,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    reward = crud_content.update_reward(db, reward_id=reward_id, reward=reward_in)
    if not reward:
        raise HTTPException(status_code=404, detail="Reward not found")
    return reward

@router.delete("/rewards/{reward_id}", response_model=dict)
def delete_reward(
    *,
    db: Session = Depends(deps.get_db),
    reward_id: str,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    success = crud_content.delete_reward(db, reward_id=reward_id)
    if not success:
        raise HTTPException(status_code=404, detail="Reward not found")
    return {"status": "success"}

# --- DIALOGUES ---
@router.get("/dialogues/{challenge_id}", response_model=List[DialogueResponse])
def read_dialogues(
    challenge_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    return crud_content.get_dialogues(db, challenge_id=challenge_id)

@router.post("/dialogues", response_model=DialogueResponse)
def create_dialogue(
    *,
    db: Session = Depends(deps.get_db),
    dialogue_in: DialogueCreate,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    return crud_content.create_dialogue(db=db, dialogue=dialogue_in)

@router.put("/dialogues/{dialogue_id}", response_model=DialogueResponse)
def update_dialogue(
    *,
    db: Session = Depends(deps.get_db),
    dialogue_id: str,
    dialogue_in: DialogueUpdate,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    dialogue = crud_content.update_dialogue(db, dialogue_id=dialogue_id, dialogue=dialogue_in)
    if not dialogue:
        raise HTTPException(status_code=404, detail="Dialogue not found")
    return dialogue

@router.delete("/dialogues/{dialogue_id}", response_model=dict)
def delete_dialogue(
    *,
    db: Session = Depends(deps.get_db),
    dialogue_id: str,
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    success = crud_content.delete_dialogue(db, dialogue_id=dialogue_id)
    if not success:
        raise HTTPException(status_code=404, detail="Dialogue not found")
    return {"status": "success"}

# --- ANALYTICS ---
@router.get("/analytics/summary")
def get_analytics_summary(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_admin_user)
) -> Any:
    from app.models.user import User
    from app.models.progress import CompletedChallenge, ChallengeAttempt
    
    total_users = db.query(User).count()
    total_completed = db.query(CompletedChallenge).count()
    total_attempts = db.query(ChallengeAttempt).count()
    
    return {
        "total_users": total_users,
        "total_completed_challenges": total_completed,
        "total_challenge_attempts": total_attempts
    }
