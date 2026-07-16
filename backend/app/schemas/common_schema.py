"""
Shared/generic Pydantic response wrappers used across all API modules.
"""
from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class ResponseModel(BaseModel, Generic[T]):
    success: bool = True
    message: str = "OK"
    data: Optional[T] = None


class ErrorResponseModel(BaseModel):
    success: bool = False
    error_code: str
    message: str
    details: Optional[dict] = None


class PaginationParams(BaseModel):
    limit: int = 20
    offset: int = 0
