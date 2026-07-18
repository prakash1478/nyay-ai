"""
/chat routes: legal chatbot conversation endpoint (multi-language) and
session history.
"""
from fastapi import APIRouter, Depends, Request
from app.schemas.chat_schema import ChatRequest, ChatResponse, ChatHistoryOut
from app.schemas.common_schema import ResponseModel
from app.services.chatbot_service import handle_chat_message
from app.services.history_service import get_chat_session
from app.config.settings import settings
from app.database.collections import chat_history_repo, sessions_repo
from app.middleware.auth_middleware import get_current_uid
from app.middleware.rate_limiter import limiter
from app.utils.exceptions import AuthorizationError
from app.utils.logger import logger

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


@router.delete("/session/{session_id}")
async def delete_session(session_id: str, uid: str = Depends(get_current_uid)):
    import requests as http_requests
    session = sessions_repo.get_or_404(session_id)
    if session.get("user_id") != uid:
        raise AuthorizationError("You do not have access to this session")
    try:
        headers = {
            "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        }
        chat_url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/chat_history"
        http_requests.delete(chat_url, headers=headers, params={"session_id": f"eq.{session_id}"}, timeout=20)
    except Exception as exc:
        logger.warning(f"Failed to delete chat_history for session {session_id}: {exc}")
    sessions_repo.delete(session_id)
    return ResponseModel(message="Session deleted")
