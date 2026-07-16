"""
Translation service wrapping googletrans for Tamil, English, Hindi,
Malayalam and Telugu. Used for translating chatbot replies and document
summaries.
"""
from googletrans import Translator
from app.utils.constants import SUPPORTED_LANGUAGES
from app.utils.exceptions import ValidationError, ExternalServiceError
from app.utils.logger import logger

_translator = Translator()


def translate_text(text: str, target_language: str, source_language: str = "auto") -> dict:
    if target_language not in SUPPORTED_LANGUAGES:
        raise ValidationError(
            f"Unsupported target language '{target_language}'. "
            f"Supported: {list(SUPPORTED_LANGUAGES.keys())}"
        )
    try:
        result = _translator.translate(text, dest=target_language, src=source_language)
        return {
            "original_text": text,
            "translated_text": result.text,
            "source_language": result.src,
            "target_language": target_language,
        }
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Translation failed: {exc}")
        raise ExternalServiceError("Translation service is currently unavailable") from exc


def detect_language(text: str) -> str:
    try:
        detection = _translator.detect(text)
        return detection.lang
    except Exception as exc:  # noqa: BLE001
        logger.warning(f"Language detection failed, defaulting to 'en': {exc}")
        return "en"
