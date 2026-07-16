"""
Document upload orchestration: saves the file, extracts text (native
extraction for PDF/DOCX/TXT, OCR for images), and stores metadata in
Firestore's uploaded_documents collection.
"""
import os
from fastapi import UploadFile
from app.database.collections import uploaded_documents_repo
from app.services import text_extraction_service, ocr_service
from app.utils.file_utils import save_upload_file
from app.utils.validators import is_allowed_document, is_allowed_image, get_file_extension
from app.utils.exceptions import UnsupportedFileTypeError
from app.utils.logger import logger


async def process_upload(user_id: str, upload_file: UploadFile) -> dict:
    filename = upload_file.filename
    if not (is_allowed_document(filename) or is_allowed_image(filename)):
        raise UnsupportedFileTypeError(
            f"File type '{get_file_extension(filename)}' is not supported. "
            "Allowed: PDF, DOCX, TXT, PNG, JPG, JPEG."
        )

    saved_path = await save_upload_file(upload_file, subfolder="documents")
    ext = get_file_extension(filename)

    if is_allowed_image(filename):
        ocr_result = ocr_service.extract_text_from_image(saved_path)
        extracted_text = ocr_result["extracted_text"]
        file_type = "image"
    else:
        extracted_text = text_extraction_service.extract_text(saved_path)
        file_type = ext.replace(".", "")

    doc_record = uploaded_documents_repo.create(
        {
            "user_id": user_id,
            "filename": filename,
            "file_path": saved_path,
            "file_type": file_type,
            "extracted_text": extracted_text,
        }
    )
    logger.info(f"Processed upload '{filename}' for user {user_id} -> document_id={doc_record['id']}")
    return doc_record


def get_document(document_id: str, user_id: str) -> dict:
    from app.utils.exceptions import NotFoundError, AuthorizationError
    doc = uploaded_documents_repo.get_or_404(document_id)
    if doc.get("user_id") != user_id:
        raise AuthorizationError("You do not have access to this document")
    return doc
