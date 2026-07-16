from dataclasses import dataclass, field
from typing import Optional
import datetime


@dataclass
class ChatMessageModel:
    user_id: str
    session_id: str
    role: str
    message: str
    language: str = "en"
    is_legal: bool = True
    id: str = ""
    metadata: Optional[dict] = None
    created_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "session_id": self.session_id,
            "role": self.role,
            "message": self.message,
            "language": self.language,
            "is_legal": self.is_legal,
            "metadata": self.metadata or {},
            "created_at": self.created_at,
        }
