from typing import Optional
from sqlalchemy.orm import Session
from uuid import UUID
from app.models.progress import PlayerProgress, CompletedChallenge, ChallengeStatus
from app.schemas.progress import PlayerProgressState

def get_progress(db: Session, user_id: UUID) -> Optional[PlayerProgressState]:
    progress = db.query(PlayerProgress).filter(PlayerProgress.user_id == user_id).first()
    if not progress:
        return None
    
    # We should reconstruct PlayerProgressState
    # `completedIds` are stored separately in `completed_challenges` if we strictly normalize, 
    # but for simplicity let's just use what's in the DB if we decide to cache them in JSON or query them.
    # The blueprint says: "Challenge Progression (Relational)"
    
    # Let's fetch completed challenges
    completed_rows = db.query(CompletedChallenge).filter(
        CompletedChallenge.user_id == user_id, 
        CompletedChallenge.status == ChallengeStatus.COMPLETED
    ).all()
    completed_ids = [c.challenge_id for c in completed_rows]

    return PlayerProgressState(
        level=progress.level,
        xp=progress.xp,
        coins=progress.coins,
        gems=progress.gems,
        currentIsland=progress.current_island,
        currentNPC=progress.current_npc,
        inventory=progress.inventory,
        badges=progress.badges,
        completedIds=completed_ids,
        unlockedIds=progress.unlocked_ids,
        currentChallengeId=progress.current_challenge_id,
        unlocks=progress.unlocks,
        fleet=progress.fleet,
        last_saved_at=progress.last_saved_at
    )

def sync_progress(db: Session, user_id: UUID, state: PlayerProgressState) -> PlayerProgressState:
    progress = db.query(PlayerProgress).filter(PlayerProgress.user_id == user_id).first()
    
    if not progress:
        progress = PlayerProgress(user_id=user_id)
        db.add(progress)
    
    # Time conflict resolution could go here, but for now we just trust the client payload
    progress.level = state.level
    progress.xp = state.xp
    progress.coins = state.coins
    progress.gems = state.gems
    progress.current_island = state.currentIsland
    progress.current_npc = state.currentNPC
    progress.inventory = state.inventory
    progress.badges = state.badges
    progress.unlocked_ids = state.unlockedIds
    progress.current_challenge_id = state.currentChallengeId
    progress.unlocks = state.unlocks
    progress.fleet = state.fleet.model_dump() # Convert Pydantic to dict for JSON column

    # Handle Completed Challenges (Relational Sync)
    # Get existing completed
    existing = db.query(CompletedChallenge).filter(
        CompletedChallenge.user_id == user_id
    ).all()
    existing_ids = {c.challenge_id for c in existing}

    # Add missing ones
    for c_id in state.completedIds:
        if c_id not in existing_ids:
            new_completion = CompletedChallenge(
                user_id=user_id,
                challenge_id=c_id,
                status=ChallengeStatus.COMPLETED
            )
            db.add(new_completion)

    db.commit()
    
    return get_progress(db, user_id)
