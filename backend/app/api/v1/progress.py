from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.api import deps
from app.models.user import User
from app.schemas.progress import ProgressSyncRequest, ProgressSyncResponse, PlayerProgressState
from app.crud.crud_progress import get_progress, sync_progress

router = APIRouter()

@router.get("/", response_model=PlayerProgressState)
def read_progress(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user's progress.
    """
    progress = get_progress(db, user_id=current_user.id)
    if not progress:
        raise HTTPException(status_code=404, detail="Progress not found")
    return progress

@router.post("/sync", response_model=ProgressSyncResponse)
def sync_player_progress(
    *,
    db: Session = Depends(deps.get_db),
    sync_request: ProgressSyncRequest,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Sync player progress from client to cloud.
    """
    new_state = sync_progress(db, user_id=current_user.id, state=sync_request.state)
    return ProgressSyncResponse(
        status="success",
        message="Progress synchronized successfully",
        state=new_state,
        server_timestamp=datetime.now(timezone.utc)
    )
