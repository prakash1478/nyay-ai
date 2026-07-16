"""
Speech-to-text service using OpenAI Whisper (local inference) with a
SpeechRecognition-based fallback for lightweight/short audio clips.
"""
from app.config.settings import settings
from app.utils.exceptions import ExternalServiceError
from app.utils.logger import logger

_whisper_model = None


def _get_whisper_model():
    global _whisper_model
    if _whisper_model is None:
        import whisper  # imported lazily; heavy model load
        logger.info(f"Loading Whisper model '{settings.WHISPER_MODEL_SIZE}' (first call only)...")
        _whisper_model = whisper.load_model(settings.WHISPER_MODEL_SIZE)
    return _whisper_model


WHISPER_LANG_MAP = {"en": "en", "ta": "ta", "hi": "hi", "ml": "ml", "te": "te"}


def transcribe_audio(file_path: str, language: str = "en") -> dict:
    """
    Transcribes an audio file to text using Whisper.
    language: expected spoken language hint (ISO code); Whisper will still
    auto-detect if the hint is wrong.
    """
    try:
        model = _get_whisper_model()
        whisper_lang = WHISPER_LANG_MAP.get(language, None)
        result = model.transcribe(file_path, language=whisper_lang, fp16=False)
        detected_language = result.get("language", language)
        return {"transcript": result.get("text", "").strip(), "language": detected_language}
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Whisper transcription failed for {file_path}: {exc}")
        raise ExternalServiceError("Speech-to-text transcription failed") from exc


def transcribe_audio_fallback(file_path: str, language: str = "en") -> dict:
    """
    Lightweight fallback using the `speech_recognition` package with Google's
    free Web Speech API. Useful when Whisper is unavailable (e.g. constrained
    environments without ffmpeg / torch).
    """
    import speech_recognition as sr

    recognizer = sr.Recognizer()
    lang_map = {"en": "en-IN", "ta": "ta-IN", "hi": "hi-IN", "ml": "ml-IN", "te": "te-IN"}
    try:
        with sr.AudioFile(file_path) as source:
            audio = recognizer.record(source)
        text = recognizer.recognize_google(audio, language=lang_map.get(language, "en-IN"))
        return {"transcript": text, "language": language}
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Fallback STT failed for {file_path}: {exc}")
        raise ExternalServiceError("Speech-to-text transcription failed") from exc
