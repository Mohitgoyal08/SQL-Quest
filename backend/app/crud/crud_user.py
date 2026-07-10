from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User, PlayerProfile
from app.schemas.user import UserCreate
from app.core.security import get_password_hash
from uuid import UUID

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def get_profile_by_user_id(db: Session, user_id: UUID) -> Optional[PlayerProfile]:
    return db.query(PlayerProfile).filter(PlayerProfile.user_id == user_id).first()

def create_user(db: Session, obj_in: UserCreate) -> User:
    # 1. Create User
    db_obj = User(
        email=obj_in.email,
        hashed_password=get_password_hash(obj_in.password),
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)

    # 2. Create Profile
    profile_obj = PlayerProfile(
        user_id=db_obj.id,
        display_name=obj_in.display_name,
        avatar_id=obj_in.avatar_id or "pirate-boy"
    )
    db.add(profile_obj)
    db.commit()
    
    return db_obj
