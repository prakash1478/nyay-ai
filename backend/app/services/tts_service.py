"""
Text-to-speech service using Google Text-to-Speech (gTTS).
Generated audio files are written to the uploads/tts directory and served
back to the client via a URL path.
"""
import os
import uuid
from gtts import gTTS
from app.config.settings import settings
from app.utils.exceptions import ExternalServiceError, ValidationError
from app.utils.constants import SUPPORTED_LANGUAGES
from app.utils.logger import logger

TTS_OUTPUT_DIR = os.path.join(settings.UPLOAD_DIR, "tts")


def synthesize_speech(text: str, language: str = "en") -> dict:
    if language not in SUPPORTED_LANGUAGES:
        raise ValidationError(f"Unsupported language '{language}' for TTS")

    os.makedirs(TTS_OUTPUT_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}.mp3"
    file_path = os.path.join(TTS_OUTPUT_DIR, filename)

    try:
        tts = gTTS(text=text, lang=language)
        tts.save(file_path)
        logger.info(f"Generated TTS audio at {file_path}")
        return {"audio_file_url": f"/static/tts/{filename}", "file_path": file_path, "language": language}
    except Exception as exc:  # noqa: BLE001
        logger.error(f"TTS synthesis failed: {exc}")
        raise ExternalServiceError("Text-to-speech synthesis failed") from exc
