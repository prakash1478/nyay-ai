from app.database.collections import users_repo
from app.utils.exceptions import NotFoundError


def get_profile(user_id: str) -> dict:
    user = users_repo.get(user_id)
    if not user:
        raise NotFoundError("User profile not found")
    return user


def update_profile(user_id: str, updates: dict) -> dict:
    clean_updates = {k: v for k, v in updates.items() if v is not None}
    if not clean_updates:
        return get_profile(user_id)
    user = users_repo.get(user_id)
    if not user:
        raise NotFoundError("User profile not found")
    return users_repo.update(user_id, clean_updates)
