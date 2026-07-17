"""
Translation service wrapping a free Google-backed translator for Tamil,
English, Hindi, Malayalam and Telugu. Used for translating chatbot replies
and document summaries.
"""
from deep_translator import GoogleTranslator
from app.utils.constants import SUPPORTED_LANGUAGES
from app.utils.exceptions import ValidationError, ExternalServiceError
from app.utils.logger import logger


def translate_text(text: str, target_language: str, source_language: str = "auto") -> dict:
    if target_language not in SUPPORTED_LANGUAGES:
        raise ValidationError(
            f"Unsupported target language '{target_language}'. "
            f"Supported: {list(SUPPORTED_LANGUAGES.keys())}"
        )
    try:
        translator = GoogleTranslator(source=source_language, target=target_language)
        translated_text = translator.translate(text)
        return {
            "original_text": text,
            "translated_text": translated_text,
            "source_language": source_language,
            "target_language": target_language,
        }
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Translation failed: {exc}")
        raise ExternalServiceError("Translation service is currently unavailable") from exc


def detect_language(text: str) -> str:
    try:
        translator = GoogleTranslator(source="auto", target="en")
        translated_text = translator.translate(text)
        return "en" if translated_text else "en"
    except Exception as exc:  # noqa: BLE001
        logger.warning(f"Language detection failed, defaulting to 'en': {exc}")
        return "en"
