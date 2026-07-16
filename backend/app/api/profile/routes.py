"""
/profile routes: get and update the authenticated user's profile.
"""
from fastapi import APIRouter, Depends
from app.schemas.profile_schema import ProfileOut, ProfileUpdateRequest
from app.schemas.common_schema import ResponseModel
from app.services import user_service
from app.middleware.auth_middleware import get_current_uid

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ResponseModel[ProfileOut])
async def get_profile(uid: str = Depends(get_current_uid)):
    return ResponseModel(message="Profile fetched", data=user_service.get_profile(uid))


@router.put("", response_model=ResponseModel[ProfileOut])
async def update_profile(payload: ProfileUpdateRequest, uid: str = Depends(get_current_uid)):
    updated = user_service.update_profile(uid, payload.model_dump())
    return ResponseModel(message="Profile updated", data=updated)
