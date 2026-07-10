from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

# Shared properties
class UserBase(BaseModel):
    email: EmailStr

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str
    display_name: str
    avatar_id: Optional[str] = "pirate-boy"

# Properties to receive via API on update
class UserUpdate(BaseModel):
    password: Optional[str] = None
    display_name: Optional[str] = None
    avatar_id: Optional[str] = None

class UserInDBBase(UserBase):
    id: UUID
    role: UserRole

    class Config:
        from_attributes = True

# Additional properties to return via API
class UserResponse(UserInDBBase):
    display_name: str
    avatar_id: str

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    type: Optional[str] = None
