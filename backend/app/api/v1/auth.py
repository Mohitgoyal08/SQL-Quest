from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.schemas.user import UserCreate, UserResponse, Token, TokenPayload
from app.crud.crud_user import get_user_by_email, create_user, get_user_by_id, get_profile_by_user_id
from app.core.config import settings
from jose import jwt, JWTError

router = APIRouter()

@router.post("/register", response_model=UserResponse)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Register a new user.
    """
    user = get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = create_user(db, obj_in=user_in)
    profile = get_profile_by_user_id(db, user_id=user.id)
    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
        "display_name": profile.display_name,
        "avatar_id": profile.avatar_id
    }

@router.post("/login", response_model=Token)
def login_access_token(
    response: Response,
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = get_user_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    
    # Set refresh token in HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
        secure=False # Should be True in prod with HTTPS
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/refresh", response_model=Token)
def refresh_token(
    response: Response,
    refresh_token: str = Cookie(None),
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Refresh access token using the refresh token from cookie.
    """
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    
    try:
        payload = jwt.decode(
            refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        if token_data.type != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    import uuid
    try:
        user_uuid = uuid.UUID(token_data.sub)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
        
    user = get_user_by_id(db, user_id=user_uuid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    access_token = create_access_token(user.id)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/logout")
def logout(response: Response) -> Any:
    """
    Logout the user by clearing the refresh token cookie.
    """
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}
