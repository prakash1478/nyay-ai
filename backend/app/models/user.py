from dataclasses import dataclass, field
from typing import Optional
import datetime


@dataclass
class UserModel:
    uid: str
    email: str
    name: str
    picture: Optional[str] = None
    provider: str = "google"
    preferred_language: str = "en"
    phone: Optional[str] = None
    is_active: bool = True
    id: str = ""
    created_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "uid": self.uid,
            "email": self.email,
            "name": self.name,
            "picture": self.picture,
            "provider": self.provider,
            "preferred_language": self.preferred_language,
            "phone": self.phone,
            "is_active": self.is_active,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
