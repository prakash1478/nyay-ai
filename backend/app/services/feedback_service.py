"""
User feedback service.
"""
from app.database.collections import feedback_repo


def submit_feedback(user_id: str, category: str, message: str, rating: int) -> dict:
    return feedback_repo.create(
        {"user_id": user_id, "category": category, "message": message, "rating": rating}
    )


def list_feedback_for_user(user_id: str) -> list:
    return feedback_repo.query(filters=[("user_id", "==", user_id)], order_by="created_at", descending=True)
