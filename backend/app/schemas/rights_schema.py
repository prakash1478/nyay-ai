"""
Pydantic schemas for the 'Know Your Rights' module.
"""
from typing import List, Optional
from pydantic import BaseModel


class RightsCategoryOut(BaseModel):
    category: str
    display_name: str


class RightsEntryOut(BaseModel):
    id: str
    category: str
    title: str
    description: str
    key_points: List[str]
    relevant_laws: List[str]
    language: str = "en"


class RightsQueryRequest(BaseModel):
    category: Optional[str] = None
    query: Optional[str] = None
    language: str = "en"
