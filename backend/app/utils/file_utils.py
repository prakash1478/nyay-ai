"""
File handling helpers: saving uploads, size validation, cleanup.
"""
import os
import uuid
from fastapi import UploadFile
from app.config.settings import settings
from app.utils.exceptions import FileTooLargeError
from app.utils.logger import logger


def ensure_upload_dir():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


async def save_upload_file(upload_file: UploadFile, subfolder: str = "") -> str:
    """
    Persist an UploadFile to disk under settings.UPLOAD_DIR and return the saved path.
    Enforces the configured max upload size.
    """
    ensure_upload_dir()
    target_dir = os.path.join(settings.UPLOAD_DIR, subfolder) if subfolder else settings.UPLOAD_DIR
    os.makedirs(target_dir, exist_ok=True)

    ext = os.path.splitext(upload_file.filename)[1]
    unique_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(target_dir, unique_name)

    size = 0
    with open(dest_path, "wb") as buffer:
        while chunk := await upload_file.read(1024 * 1024):
            size += len(chunk)
            if size > settings.max_upload_size_bytes:
                buffer.close()
                os.remove(dest_path)
                raise FileTooLargeError(
                    f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB} MB"
                )
            buffer.write(chunk)

    await upload_file.seek(0)
    logger.info(f"Saved uploaded file to {dest_path} ({size} bytes)")
    return dest_path


def delete_file_safe(path: str):
    try:
        if path and os.path.exists(path):
            os.remove(path)
    except Exception as exc:  # noqa: BLE001
        logger.warning(f"Could not delete file {path}: {exc}")
