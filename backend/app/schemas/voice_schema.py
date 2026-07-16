"""
Pydantic schemas for speech-to-text and text-to-speech endpoints.
"""
from pydantic import BaseModel, Field


class STTResponse(BaseModel):
    transcript: str
    language: str


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=4000)
    language: str = Field("en", description="ISO code: en, ta, hi, ml, te")


class TTSResponse(BaseModel):
    audio_file_url: str
    language: str
