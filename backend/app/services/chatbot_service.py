"""
Legal chatbot orchestration:
1. Classifies whether the incoming message is a legal question.
2. Retrieves relevant context from the FAISS legal knowledge base.
3. Calls the LLM with a strict legal-only system prompt.
4. Persists the conversation turn to Firestore chat_history.
5. Optionally translates the reply into the user's preferred language.
"""
import uuid
from typing import Optional
from app.services.langchain_service import get_llm, similarity_search, LEGAL_SYSTEM_PROMPT
from app.services.translation_service import translate_text
from app.database.collections import chat_history_repo
from app.utils.validators import is_legal_query
from app.utils.exceptions import NonLegalQueryError
from app.utils.logger import logger

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


def handle_chat_message(user_id: str, message: str, session_id: Optional[str], language: str = "en") -> dict:
    from langchain_core.messages import SystemMessage, HumanMessage

    session_id = session_id or str(uuid.uuid4())

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
        ai_response = llm.invoke(messages)
        reply_text = ai_response.content if hasattr(ai_response, "content") else str(ai_response)
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
            final_reply = translate_text(reply_text, target_language=language, source_language="en")["translated_text"]
        except Exception as exc:  # noqa: BLE001
            logger.warning(f"Translation of chat reply failed, returning English: {exc}")

    # Persist both turns
    chat_history_repo.create(
        {"user_id": user_id, "session_id": session_id, "role": "user", "message": message, "language": language, "is_legal": is_legal}
    )
    chat_history_repo.create(
        {"user_id": user_id, "session_id": session_id, "role": "assistant", "message": final_reply, "language": language, "is_legal": is_legal}
    )

    return {
        "session_id": session_id,
        "reply": final_reply,
        "language": language,
        "is_legal": is_legal,
    }
