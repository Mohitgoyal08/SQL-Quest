from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.schemas.user import UserResponse
from app.crud.crud_user import get_profile_by_user_id

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def read_user_me(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    profile = get_profile_by_user_id(db, user_id=current_user.id)
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "display_name": profile.display_name,
        "avatar_id": profile.avatar_id
    }
