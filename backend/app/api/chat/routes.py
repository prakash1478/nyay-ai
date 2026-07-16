"""
/chat routes: legal chatbot conversation endpoint (multi-language) and
session history.
"""
from fastapi import APIRouter, Depends, Request
from app.schemas.chat_schema import ChatRequest, ChatResponse, ChatHistoryOut
from app.schemas.common_schema import ResponseModel
from app.services.chatbot_service import handle_chat_message
from app.services.history_service import get_chat_session
from app.middleware.auth_middleware import get_current_uid
from app.middleware.rate_limiter import limiter

router = APIRouter(prefix="/chat", tags=["Chatbot"])


@router.post("", response_model=ResponseModel[ChatResponse])
@limiter.limit("15/minute")
async def chat(request: Request, payload: ChatRequest, uid: str = Depends(get_current_uid)):
    result = handle_chat_message(
        user_id=uid, message=payload.message, session_id=payload.session_id, language=payload.language
    )
    return ResponseModel(message="Reply generated", data=result)


@router.get("/session/{session_id}", response_model=ResponseModel[ChatHistoryOut])
async def get_session(session_id: str, uid: str = Depends(get_current_uid)):
    result = get_chat_session(uid, session_id)
    return ResponseModel(message="Session fetched", data=result)
