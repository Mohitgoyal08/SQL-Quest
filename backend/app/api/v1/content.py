from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.content import IslandResponse, ChallengeResponse, RewardResponse, DialogueResponse
from app.crud.crud_content import get_islands, get_challenges, get_rewards, get_dialogues
from app.models.content import Challenge, Reward, Dialogue

router = APIRouter()

@router.get("/islands", response_model=List[IslandResponse])
def read_islands(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve all islands."""
    return get_islands(db, skip=skip, limit=limit)

@router.get("/challenges", response_model=List[ChallengeResponse])
def read_challenges(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 1000,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve all active challenges."""
    # We should only fetch active challenges for the game, 
    # but the crud method get_challenges fetches all. Let's filter here for now.
    challenges = db.query(Challenge).filter(Challenge.is_active == True).order_by(Challenge.order_index).offset(skip).limit(limit).all()
    return challenges

@router.get("/rewards", response_model=List[RewardResponse])
def read_rewards(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 1000,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve all rewards."""
    rewards = db.query(Reward).offset(skip).limit(limit).all()
    return rewards

@router.get("/dialogues", response_model=List[DialogueResponse])
def read_dialogues(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 1000,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Retrieve all dialogues."""
    dialogues = db.query(Dialogue).offset(skip).limit(limit).all()
    return dialogues
