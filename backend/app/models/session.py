from dataclasses import dataclass, field
from typing import Optional
import datetime


@dataclass
class SessionModel:
    user_id: str
    title: Optional[str] = None
    language: str = "en"
    is_active: bool = True
    id: str = ""
    created_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "language": self.language,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
