"""
/translate routes: translate arbitrary text (chatbot replies, document
summaries, etc.) between English, Tamil, Hindi, Malayalam, and Telugu.
"""
from fastapi import APIRouter, Depends, Request
from app.schemas.translate_schema import TranslateRequest, TranslateResponse
from app.schemas.common_schema import ResponseModel
from app.services.translation_service import translate_text
from app.middleware.auth_middleware import get_current_uid
from app.middleware.rate_limiter import limiter

router = APIRouter(prefix="/translate", tags=["Translation"])


@router.post("", response_model=ResponseModel[TranslateResponse])
@limiter.limit("30/minute")
async def translate(request: Request, payload: TranslateRequest, uid: str = Depends(get_current_uid)):
    result = translate_text(payload.text, payload.target_language, payload.source_language)
    return ResponseModel(message="Translation completed", data=result)
