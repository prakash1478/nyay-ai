"""
Pydantic schemas for authentication endpoints.
"""
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class GoogleLoginRequest(BaseModel):
    id_token: str = Field(..., description="Google OAuth2 ID token from the client")


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class UserOut(BaseModel):
    uid: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    preferred_language: str = "en"


class LoginResponse(BaseModel):
    user: UserOut
    tokens: TokenResponse
