"""
/history routes: unified activity history for chat sessions, uploaded
documents and their analyses.
"""
from fastapi import APIRouter, Depends
from app.schemas.common_schema import ResponseModel
from app.services import history_service
from app.middleware.auth_middleware import get_current_uid

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/chats", response_model=ResponseModel[list])
async def chat_history(uid: str = Depends(get_current_uid)):
    return ResponseModel(message="Chat history fetched", data=history_service.get_chat_sessions(uid))


@router.get("/documents", response_model=ResponseModel[list])
async def document_history(uid: str = Depends(get_current_uid)):
    return ResponseModel(message="Document history fetched", data=history_service.get_document_history(uid))


@router.get("/analyses", response_model=ResponseModel[list])
async def analysis_history(uid: str = Depends(get_current_uid)):
    return ResponseModel(message="Analysis history fetched", data=history_service.get_analysis_history(uid))
