"""
Pydantic schemas for the translation module.
"""
from pydantic import BaseModel, Field


class TranslateRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=8000)
    target_language: str = Field(..., description="ISO code: en, ta, hi, ml, te")
    source_language: str = Field("auto", description="ISO code or 'auto' to detect")


class TranslateResponse(BaseModel):
    original_text: str
    translated_text: str
    source_language: str
    target_language: str
