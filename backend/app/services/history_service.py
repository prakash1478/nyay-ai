"""
Retrieves chat and activity history for a user (chat sessions, uploaded
documents, and their analyses) from Firestore.
"""
from collections import defaultdict
from app.database.collections import chat_history_repo, uploaded_documents_repo, document_analysis_repo


def get_chat_sessions(user_id: str) -> list:
    records = chat_history_repo.query(filters=[("user_id", "==", user_id)], order_by="created_at", descending=False)
    sessions = defaultdict(list)
    for r in records:
        sessions[r["session_id"]].append(r)
    return [{"session_id": sid, "messages": msgs} for sid, msgs in sessions.items()]


def get_chat_session(user_id: str, session_id: str) -> dict:
    records = chat_history_repo.query(
        filters=[("user_id", "==", user_id), ("session_id", "==", session_id)],
        order_by="created_at",
        descending=False,
    )
    return {"session_id": session_id, "messages": records}


def get_document_history(user_id: str) -> list:
    return uploaded_documents_repo.query(filters=[("user_id", "==", user_id)], order_by="created_at", descending=True)


def get_analysis_history(user_id: str) -> list:
    return document_analysis_repo.query(filters=[("user_id", "==", user_id)], order_by="created_at", descending=True)
