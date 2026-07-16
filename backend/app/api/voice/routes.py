"""
/stt and /tts routes: speech-to-text (Whisper) and text-to-speech (gTTS).
"""
from fastapi import APIRouter, Depends, File, UploadFile, Form, Request
from app.schemas.voice_schema import STTResponse, TTSRequest, TTSResponse
from app.schemas.common_schema import ResponseModel
from app.services import stt_service, tts_service
from app.middleware.auth_middleware import get_current_uid
from app.middleware.rate_limiter import limiter
from app.utils.file_utils import save_upload_file
from app.utils.validators import is_allowed_audio
from app.utils.exceptions import UnsupportedFileTypeError

router = APIRouter(tags=["Voice"])


@router.post("/stt", response_model=ResponseModel[STTResponse])
@limiter.limit("10/minute")
async def speech_to_text(
    request: Request,
    file: UploadFile = File(...),
    language: str = Form("en"),
    uid: str = Depends(get_current_uid),
):
    if not is_allowed_audio(file.filename):
        raise UnsupportedFileTypeError("Unsupported audio format for speech-to-text")
    saved_path = await save_upload_file(file, subfolder="audio")
    try:
        result = stt_service.transcribe_audio(saved_path, language)
    except Exception:
        result = stt_service.transcribe_audio_fallback(saved_path, language)
    return ResponseModel(message="Transcription completed", data=result)


@router.post("/tts", response_model=ResponseModel[TTSResponse])
@limiter.limit("15/minute")
async def text_to_speech(request: Request, payload: TTSRequest, uid: str = Depends(get_current_uid)):
    result = tts_service.synthesize_speech(payload.text, payload.language)
    data = TTSResponse(audio_file_url=result["audio_file_url"], language=result["language"])
    return ResponseModel(message="Speech synthesized", data=data)
