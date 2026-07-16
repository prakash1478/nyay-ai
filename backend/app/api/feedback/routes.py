"""
/feedback routes: users can submit and view their feedback.
"""
from fastapi import APIRouter, Depends
from app.schemas.feedback_schema import FeedbackRequest, FeedbackOut
from app.schemas.common_schema import ResponseModel
from app.services import feedback_service
from app.middleware.auth_middleware import get_current_uid

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.post("", response_model=ResponseModel[FeedbackOut])
async def submit_feedback(payload: FeedbackRequest, uid: str = Depends(get_current_uid)):
    result = feedback_service.submit_feedback(uid, payload.category, payload.message, payload.rating)
    return ResponseModel(message="Feedback submitted, thank you!", data=result)


@router.get("", response_model=ResponseModel[list[FeedbackOut]])
async def list_feedback(uid: str = Depends(get_current_uid)):
    return ResponseModel(message="Feedback fetched", data=feedback_service.list_feedback_for_user(uid))
