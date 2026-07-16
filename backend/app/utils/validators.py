"""
Reusable validation helpers.
"""
import os
from app.utils.constants import (
    ALLOWED_DOCUMENT_EXTENSIONS,
    ALLOWED_IMAGE_EXTENSIONS,
    ALLOWED_AUDIO_EXTENSIONS,
    LEGAL_KEYWORDS,
)


def get_file_extension(filename: str) -> str:
    return os.path.splitext(filename)[1].lower()


def is_allowed_document(filename: str) -> bool:
    ext = get_file_extension(filename)
    return ext in ALLOWED_DOCUMENT_EXTENSIONS or ext in ALLOWED_IMAGE_EXTENSIONS


def is_allowed_image(filename: str) -> bool:
    return get_file_extension(filename) in ALLOWED_IMAGE_EXTENSIONS


def is_allowed_audio(filename: str) -> bool:
    return get_file_extension(filename) in ALLOWED_AUDIO_EXTENSIONS


def is_legal_query(text: str) -> bool:
    """
    Lightweight heuristic keyword-based legal-domain classifier.
    Used as a fast pre-filter before (optionally) calling an LLM-based classifier
    in chatbot_service for a more nuanced decision.
    """
    if not text:
        return False
    lowered = text.lower()
    return any(keyword in lowered for keyword in LEGAL_KEYWORDS)
