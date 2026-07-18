"""
Legal document analysis service. Uses the LLM to produce a structured JSON
analysis of a legal document: summary, plain-English summary, important
clauses, hidden fees, illegal/unfair clauses, and a computed risk score.
"""
import json
import re
from app.services.langchain_service import get_llm
from app.services.translation_service import translate_text
from app.services.document_service import get_document
from app.database.collections import document_analysis_repo
from app.utils.constants import RISK_LEVELS
from app.utils.exceptions import ValidationError, ExternalServiceError
from app.utils.logger import logger

ANALYSIS_SYSTEM_PROMPT = """You are an expert Indian legal document analyst. You will be given the \
raw text of a legal document (contract, agreement, notice, etc.). Analyze it carefully and respond \
with STRICT, VALID JSON ONLY (no markdown fences, no commentary) matching exactly this schema:

{
  "summary": "A concise 3-5 sentence professional summary of the document",
  "plain_english_summary": "A plain-English explanation a non-lawyer can understand, avoiding jargon",
  "important_clauses": ["clause 1 description", "clause 2 description", "..."],
  "hidden_fees": ["description of any hidden/unclear fees or charges found, or empty list if none"],
  "illegal_clauses": ["description of any clauses that may be illegal, unfair, or unenforceable under Indian law, or empty list if none"],
  "risk_score": 0-100 integer representing overall risk to the person signing/accepting this document,
  "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

Guidelines:
- risk_score should reflect how risky/unfavorable the document is to the reader (0 = completely safe, 100 = extremely risky).
- risk_level should be derived from risk_score: 0-25 LOW, 26-50 MEDIUM, 51-75 HIGH, 76-100 CRITICAL.
- If the text is too short or not actually a legal document, still return the JSON schema with your best-effort analysis and note that in the summary.
- Do not include any text outside the JSON object.
"""


def _extract_json(raw: str) -> dict:
    raw = raw.strip()
    raw = re.sub(r"^```(json)?", "", raw).strip()
    raw = re.sub(r"```$", "", raw).strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise


def _derive_risk_level(score: int) -> str:
    if score <= 25:
        return "low"
    if score <= 50:
        return "medium"
    if score <= 75:
        return "high"
    return "critical"


def analyze_document(user_id: str, document_id: str, language: str = "en") -> dict:
    from langchain_core.messages import SystemMessage, HumanMessage

    doc = get_document(document_id, user_id)
    text = (doc.get("extracted_text") or "").strip()
    if not text:
        raise ValidationError("No extractable text found in this document")

    # Truncate extremely long documents to keep within model context limits
    truncated_text = text[:12000]

    llm = get_llm(temperature=0.1)
    messages = [
        SystemMessage(content=ANALYSIS_SYSTEM_PROMPT),
        HumanMessage(content=f"Document text:\n\n{truncated_text}"),
    ]

    try:
        response = llm.invoke(messages)
        raw_content = response.content if hasattr(response, "content") else str(response)
        parsed = _extract_json(raw_content)
    except Exception as exc:  # noqa: BLE001
        logger.error(f"Document analysis LLM call/parse failed: {exc}")
        raise ExternalServiceError("Failed to analyze document. Please try again.") from exc

    try:
        risk_score = int(parsed.get("risk_score") or 50)
    except (ValueError, TypeError):
        risk_score = 50
    risk_score = max(0, min(100, risk_score))
    risk_level = (parsed.get("risk_level") or "").lower().strip()
    risk_level = risk_level if risk_level in RISK_LEVELS else _derive_risk_level(risk_score)

    analysis_record = {
        "document_id": document_id,
        "user_id": user_id,
        "summary": parsed.get("summary") or "",
        "plain_english_summary": parsed.get("plain_english_summary") or "",
        "important_clauses": parsed.get("important_clauses") or [],
        "hidden_fees": parsed.get("hidden_fees") or [],
        "illegal_clauses": parsed.get("illegal_clauses") or [],
        "risk_score": risk_score,
        "risk_level": risk_level,
    }

    if language and language != "en":
        try:
            analysis_record["summary"] = translate_text(analysis_record["summary"], language, "en")["translated_text"]
            analysis_record["plain_english_summary"] = translate_text(
                analysis_record["plain_english_summary"], language, "en"
            )["translated_text"]
        except Exception as exc:  # noqa: BLE001
            logger.warning(f"Translation of analysis failed, keeping English: {exc}")
            language = "en"

    saved = document_analysis_repo.create(analysis_record)
    saved["language"] = language
    return saved
