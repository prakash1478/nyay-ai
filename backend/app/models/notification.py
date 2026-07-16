from dataclasses import dataclass, field
from typing import Optional
import datetime


@dataclass
class NotificationModel:
    user_id: str
    title: str
    body: str
    type: str = "info"
    is_read: bool = False
    id: str = ""
    metadata: Optional[dict] = None
    created_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "body": self.body,
            "type": self.type,
            "is_read": self.is_read,
            "metadata": self.metadata or {},
            "created_at": self.created_at,
        }
