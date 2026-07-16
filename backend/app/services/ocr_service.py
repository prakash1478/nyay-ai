"""
OCR service using EasyOCR to extract text from scanned documents / images
(e.g. photographed contracts, ID proofs, notices).
The EasyOCR Reader is loaded lazily and cached, since model loading is
expensive and should not happen at import time / app startup.
"""
from typing import Optional
from PIL import Image
import numpy as np
from app.utils.logger import logger
from app.utils.exceptions import ExternalServiceError

_reader = None
_SUPPORTED_OCR_LANGS = ["en", "hi", "ta", "te"]  # EasyOCR does not support Malayalam ('ml')


def _get_reader():
    global _reader
    if _reader is None:
        import easyocr  # imported lazily to keep API startup fast
        logger.info("Loading EasyOCR reader (first call only)...")
        _reader = easyocr.Reader(_SUPPORTED_OCR_LANGS, gpu=False)
    return _reader


def extract_text_from_image(file_path: str) -> dict:
    """
    Runs OCR on an image file and returns extracted text plus an average
    confidence score.
    """
    try:
        reader = _get_reader()
        image = Image.open(file_path).convert("RGB")
        results = reader.readtext(np.array(image))

        if not results:
            return {"extracted_text": "", "confidence": 0.0}

        lines = []
        confidences = []
        for _bbox, text, confidence in results:
            lines.append(text)
            confidences.append(confidence)

        avg_confidence = round(sum(confidences) / len(confidences), 4) if confidences else 0.0
        return {"extracted_text": "\n".join(lines).strip(), "confidence": avg_confidence}
    except Exception as exc:  # noqa: BLE001
        logger.error(f"OCR extraction failed for {file_path}: {exc}")
        raise ExternalServiceError("OCR text extraction failed") from exc
