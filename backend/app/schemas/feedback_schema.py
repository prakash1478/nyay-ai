"""
Pydantic schemas for user feedback endpoints.
"""
from pydantic import BaseModel, Field


class FeedbackRequest(BaseModel):
    category: str = Field(..., description="e.g. chatbot, document_analysis, rights, general")
    message: str = Field(..., min_length=1, max_length=2000)
    rating: int = Field(..., ge=1, le=5)


class FeedbackOut(BaseModel):
    id: str
    category: str
    message: str
    rating: int
    created_at: str
