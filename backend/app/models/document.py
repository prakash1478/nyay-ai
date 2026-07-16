from dataclasses import dataclass, field
from typing import Optional, List
import datetime


@dataclass
class UploadedDocumentModel:
    user_id: str
    filename: str
    file_path: str
    file_type: str
    extracted_text: str = ""
    id: str = ""
    file_size_bytes: int = 0
    page_count: int = 0
    language: str = "en"
    metadata: Optional[dict] = None
    created_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "filename": self.filename,
            "file_path": self.file_path,
            "file_type": self.file_type,
            "extracted_text": self.extracted_text,
            "file_size_bytes": self.file_size_bytes,
            "page_count": self.page_count,
            "language": self.language,
            "metadata": self.metadata or {},
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


@dataclass
class DocumentAnalysisModel:
    document_id: str
    user_id: str
    summary: str
    plain_english_summary: str
    important_clauses: List[str]
    hidden_fees: List[str]
    illegal_clauses: List[str]
    risk_score: int
    risk_level: str
    id: str = ""
    metadata: Optional[dict] = None
    created_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "document_id": self.document_id,
            "user_id": self.user_id,
            "summary": self.summary,
            "plain_english_summary": self.plain_english_summary,
            "important_clauses": self.important_clauses,
            "hidden_fees": self.hidden_fees,
            "illegal_clauses": self.illegal_clauses,
            "risk_score": self.risk_score,
            "risk_level": self.risk_level,
            "metadata": self.metadata or {},
            "created_at": self.created_at,
        }
