"""
Pydantic schemas for the legal chatbot endpoints.
"""
from typing import Optional, List
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: Optional[str] = Field(None, description="Existing session id to continue a conversation")
    language: str = Field("en", description="ISO code: en, ta, hi, ml, te")


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    language: str
    is_legal: bool
    sources: Optional[List[str]] = None


class ChatMessageOut(BaseModel):
    id: str
    role: str
    message: str
    language: str
    created_at: str


class ChatHistoryOut(BaseModel):
    session_id: str
    messages: List[ChatMessageOut]
