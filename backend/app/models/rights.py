from dataclasses import dataclass, field
from typing import List, Optional
import datetime


@dataclass
class RightsEntryModel:
    category: str
    title: str
    description: str
    key_points: List[str]
    relevant_laws: List[str]
    language: str = "en"
    id: str = ""
    tags: Optional[List[str]] = None
    is_published: bool = True
    created_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())
    updated_at: str = field(default_factory=lambda: datetime.datetime.utcnow().isoformat())

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "category": self.category,
            "title": self.title,
            "description": self.description,
            "key_points": self.key_points,
            "relevant_laws": self.relevant_laws,
            "language": self.language,
            "tags": self.tags or [],
            "is_published": self.is_published,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
