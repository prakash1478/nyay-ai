"""
Pydantic schemas for user profile endpoints.
"""
from typing import Optional
from pydantic import BaseModel, EmailStr


class ProfileOut(BaseModel):
    uid: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: str = "en"
    created_at: Optional[str] = None


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    preferred_language: Optional[str] = None
