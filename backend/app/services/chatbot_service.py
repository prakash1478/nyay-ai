"""
Legal chatbot orchestration:
1. Classifies whether the incoming message is a legal question.
2. Retrieves relevant context from the FAISS legal knowledge base.
3. Calls the LLM with a strict legal-only system prompt.
4. Persists the conversation turn to Firestore chat_history.
5. Optionally translates the reply into the user's preferred language.
"""
import uuid
import concurrent.futures
from typing import Optional
from app.services.langchain_service import get_llm, similarity_search, LEGAL_SYSTEM_PROMPT
from app.services.translation_service import translate_text
from app.database.collections import chat_history_repo, sessions_repo
from app.config.settings import settings
from app.utils.validators import is_legal_query
from app.utils.exceptions import NonLegalQueryError
from app.utils.logger import logger

try:
    _FUTURES_TIMEOUT_ERROR = concurrent.futures.TimeoutError
except AttributeError:
    from concurrent.futures import _base
    _FUTURES_TIMEOUT_ERROR = _base.TimeoutError

NON_LEGAL_REPLY = (
    "I'm your AI Legal Assistant, so I can only help with legal questions — things like your "
    "rights, contracts, consumer issues, employment, tenancy, cyber crime, or similar topics. "
    "Could you rephrase your question with a legal angle?"
)


def _build_context_snippet(query: str) -> str:
    try:
        docs = similarity_search(query, k=4)
        return "\n---\n".join(d.page_content for d in docs)
    except Exception as exc:  # noqa: BLE001
        logger.warning(f"Vector search unavailable, continuing without retrieval context: {exc}")
        return ""


def _get_history_messages(session_id: str, limit: int = 10) -> list:
    from langchain_core.messages import HumanMessage, AIMessage

    try:
        records = chat_history_repo.query(
            filters=[("session_id", "==", session_id)], order_by="created_at", descending=False, limit=limit
        )
        messages = []
        for r in records:
            if r["role"] == "user":
                messages.append(HumanMessage(content=r["message"]))
            else:
                messages.append(AIMessage(content=r["message"]))
        return messages
    except Exception as exc:
        logger.warning(f"Failed to load chat history: {exc}")
        return []


def _ensure_session(session_id: str, user_id: str, language: str) -> None:
    try:
        existing = sessions_repo.query(filters=[("id", "==", session_id)], limit=1)
        if not existing:
            sessions_repo.create({
                "id": session_id,
                "user_id": user_id,
                "title": None,
                "language": language,
                "is_active": True,
            })
    except Exception as exc:
        logger.warning(f"Failed to ensure session: {exc}")


def handle_chat_message(user_id: str, message: str, session_id: Optional[str], language: str = "en") -> dict:
    from langchain_core.messages import SystemMessage, HumanMessage

    session_id = session_id or str(uuid.uuid4())
    _ensure_session(session_id, user_id, language)

    # Fast heuristic pre-filter to avoid unnecessary LLM calls for obviously unrelated chit-chat
    heuristic_legal = is_legal_query(message)

    context_snippet = _build_context_snippet(message)
    history_messages = _get_history_messages(session_id)

    system_prompt = LEGAL_SYSTEM_PROMPT
    if context_snippet:
        system_prompt += f"\n\nRelevant legal knowledge base context:\n{context_snippet}"
    system_prompt += (
        "\n\nIMPORTANT: If, after reading the user's message, it is clearly NOT a legal question "
        "(e.g. small talk, coding help, entertainment, general trivia), respond with EXACTLY this "
        f"sentence and nothing else: \"{NON_LEGAL_REPLY}\""
    )

    llm = get_llm()
    messages = [SystemMessage(content=system_prompt), *history_messages, HumanMessage(content=message)]

    try:
        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
            future = pool.submit(llm.invoke, messages)
            ai_response = future.result(timeout=settings.LLM_TIMEOUT)
        reply_text = ai_response.content if hasattr(ai_response, "content") else str(ai_response)
    except _FUTURES_TIMEOUT_ERROR:
        logger.error("LLM call timed out after 15s")
        reply_text = (
            "I'm having trouble reaching the legal knowledge engine right now. "
            "Please try again in a moment."
        )
    except Exception as exc:  # noqa: BLE001
        logger.error(f"LLM call failed: {exc}")
        if not heuristic_legal:
            raise NonLegalQueryError() from exc
        reply_text = (
            "I'm having trouble reaching the legal knowledge engine right now. "
            "Please try again in a moment."
        )

    is_legal = reply_text.strip() != NON_LEGAL_REPLY

    # Translate reply if user wants a non-English language
    final_reply = reply_text
    if language and language != "en":
        try:
            final_reply = translate_text(reply_text, target_language=language, source_language="auto")["translated_text"]
        except Exception as exc:  # noqa: BLE001
            logger.warning(f"Translation of chat reply failed, returning English: {exc}")

    # Persist both turns (non-fatal)
    try:
        chat_history_repo.create(
            {"user_id": user_id, "session_id": session_id, "role": "user", "message": message, "language": language, "is_legal": is_legal}
        )
    except Exception as exc:
        logger.warning(f"Failed to persist user message: {exc}")
    try:
        chat_history_repo.create(
            {"user_id": user_id, "session_id": session_id, "role": "assistant", "message": final_reply, "language": language, "is_legal": is_legal}
        )
    except Exception as exc:
        logger.warning(f"Failed to persist assistant reply: {exc}")

    return {
        "session_id": session_id,
        "reply": final_reply,
        "language": language,
        "is_legal": is_legal,
    }
