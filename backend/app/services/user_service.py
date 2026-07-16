from app.database.collections import users_repo
from app.utils.exceptions import NotFoundError


def get_profile(uid: str) -> dict:
    user_list = users_repo.query(filters=[("uid", "==", uid)], limit=1)
    if not user_list:
        raise NotFoundError("User profile not found")
    return user_list[0]


def update_profile(uid: str, updates: dict) -> dict:
    clean_updates = {k: v for k, v in updates.items() if v is not None}
    if not clean_updates:
        return get_profile(uid)
    user_list = users_repo.query(filters=[("uid", "==", uid)], limit=1)
    if not user_list:
        raise NotFoundError("User profile not found")
    return users_repo.update(user_list[0]["id"], clean_updates)
