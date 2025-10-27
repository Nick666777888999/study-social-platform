from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    is_active: bool
    profile_image: Optional[str] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class FriendRequest(BaseModel):
    id: int
    from_user: UserResponse
    to_user: UserResponse
    status: str
    created_at: datetime

class Message(BaseModel):
    id: int
    sender: UserResponse
    receiver_id: int
    content: str
    message_type: str = "text"
    created_at: datetime
    is_read: bool = False

class ChatRoom(BaseModel):
    id: int
    name: str
    description: Optional[str]
    members: List[UserResponse]
    is_group: bool = False
    created_at: datetime

class Post(BaseModel):
    id: int
    title: str
    content: str
    author: UserResponse
    category: str
    tags: List[str] = []
    likes: int = 0
    comments: int = 0
    created_at: datetime

class StudyRoom(BaseModel):
    id: int
    name: str
    description: str
    subject: str
    current_members: int
    max_members: int
    is_public: bool = True
    created_at: datetime
