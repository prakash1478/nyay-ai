"""
/upload and /analyze routes: document upload (with OCR for images) and
AI-powered legal document analysis.
"""
from fastapi import APIRouter, Depends, File, UploadFile, Request
from app.schemas.document_schema import UploadResponse, AnalyzeRequest, DocumentAnalysisOut, OCRResponse
from app.schemas.common_schema import ResponseModel
from app.services import document_service, analysis_service, ocr_service
from app.middleware.auth_middleware import get_current_uid
from app.middleware.rate_limiter import limiter
from app.utils.file_utils import save_upload_file
from app.utils.validators import is_allowed_image
from app.utils.exceptions import UnsupportedFileTypeError

router = APIRouter(tags=["Document Analyzer"])


@router.post("/upload", response_model=ResponseModel[UploadResponse])
@limiter.limit("10/minute")
async def upload_document(request: Request, file: UploadFile = File(...), uid: str = Depends(get_current_uid)):
    doc = await document_service.process_upload(uid, file)
    preview = (doc.get("extracted_text") or "")[:300]
    data = UploadResponse(
        document_id=doc["id"], filename=doc["filename"], file_type=doc["file_type"], extracted_text_preview=preview
    )
    return ResponseModel(message="Document uploaded and text extracted", data=data)


@router.post("/ocr", response_model=ResponseModel[OCRResponse])
@limiter.limit("10/minute")
async def ocr_image(request: Request, file: UploadFile = File(...), uid: str = Depends(get_current_uid)):
    if not is_allowed_image(file.filename):
        raise UnsupportedFileTypeError("OCR endpoint only accepts image files (png, jpg, jpeg, etc.)")
    saved_path = await save_upload_file(file, subfolder="ocr")
    result = ocr_service.extract_text_from_image(saved_path)
    return ResponseModel(message="OCR completed", data=result)


@router.post("/analyze", response_model=ResponseModel[DocumentAnalysisOut])
@limiter.limit("10/minute")
async def analyze_document(request: Request, payload: AnalyzeRequest, uid: str = Depends(get_current_uid)):
    result = analysis_service.analyze_document(uid, payload.document_id, payload.language)
    return ResponseModel(message="Document analyzed", data=result)
