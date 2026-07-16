"""
Typed repository instances for each persistent collection.
Import from this module rather than instantiating a repository directly.
"""
from app.database.supabase_repository import SupabaseRepository
from app.utils.constants import Collections

users_repo = SupabaseRepository(Collections.USERS)
chat_history_repo = SupabaseRepository(Collections.CHAT_HISTORY)
rights_repo = SupabaseRepository(Collections.RIGHTS)
uploaded_documents_repo = SupabaseRepository(Collections.UPLOADED_DOCUMENTS)
document_analysis_repo = SupabaseRepository(Collections.DOCUMENT_ANALYSIS)
notifications_repo = SupabaseRepository(Collections.NOTIFICATIONS)
feedback_repo = SupabaseRepository(Collections.FEEDBACK)
sessions_repo = SupabaseRepository(Collections.SESSIONS)
