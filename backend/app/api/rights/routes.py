"""
/rights routes: Know Your Rights module (women, employment, consumer,
cyber crime, tenant, students, workers, senior citizens).
"""
from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.schemas.rights_schema import RightsEntryOut
from app.schemas.common_schema import ResponseModel
from app.services import rights_service
from app.middleware.auth_middleware import get_current_uid

router = APIRouter(prefix="/rights", tags=["Know Your Rights"])


@router.get("/categories", response_model=ResponseModel[list])
async def get_categories():
    return ResponseModel(message="Categories fetched", data=rights_service.list_categories())


@router.get("/category/{category}", response_model=ResponseModel[list[RightsEntryOut]])
async def get_by_category(category: str, language: str = Query("en"), uid: str = Depends(get_current_uid)):
    data = rights_service.get_rights_by_category(category, language)
    return ResponseModel(message=f"Rights for category '{category}' fetched", data=data)


@router.get("/search", response_model=ResponseModel[list[RightsEntryOut]])
async def search(query: str = Query(..., min_length=2), language: str = Query("en"), uid: str = Depends(get_current_uid)):
    data = rights_service.search_rights(query, language)
    return ResponseModel(message="Search completed", data=data)
