"""
Pydantic schemas for document upload, OCR, and legal document analysis.
"""
from typing import List, Optional
from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    document_id: str
    filename: str
    file_type: str
    extracted_text_preview: str


class AnalyzeRequest(BaseModel):
    document_id: str
    language: str = Field("en", description="Language to translate the summary into")


class DocumentAnalysisOut(BaseModel):
    document_id: str
    summary: str
    plain_english_summary: str
    important_clauses: List[str]
    hidden_fees: List[str]
    illegal_clauses: List[str]
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: str
    language: str = "en"


class OCRResponse(BaseModel):
    extracted_text: str
    confidence: Optional[float] = None
