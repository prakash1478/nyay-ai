from dataclasses import dataclass, field
from typing import Optional
import datetime


@dataclass
class FeedbackModel:
    user_id: str
    category: str
    message: str
    rating: int
    id: str = ""
    metadata: Optional[dict] = None
    created_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "category": self.category,
            "message": self.message,
            "rating": self.rating,
            "metadata": self.metadata or {},
            "created_at": self.created_at,
        }
