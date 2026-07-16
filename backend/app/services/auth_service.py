from app.database.collections import users_repo
from app.services import jwt_service
from app.services.google_oauth_service import verify_google_id_token
from app.config.settings import settings
from app.utils.exceptions import AuthenticationError, NotFoundError
from app.utils.logger import logger


def _get_or_create_user(google_claims: dict) -> dict:
    uid = google_claims["uid"]
    existing_list = users_repo.query(filters=[("uid", "==", uid)], limit=1)
    existing = existing_list[0] if existing_list else None
    if existing:
        return existing

    user_data = {
        "uid": uid,
        "email": google_claims.get("email"),
        "name": google_claims.get("name"),
        "picture": google_claims.get("picture"),
        "provider": "google",
        "preferred_language": "en",
        "is_active": True,
    }
    created = users_repo.create(user_data)
    logger.info(f"Provisioned new user {uid} ({user_data.get('email')})")
    return created


def login_with_google(id_token: str) -> dict:
    claims = verify_google_id_token(id_token)
    if not claims.get("email_verified", True):
        raise AuthenticationError("Google email is not verified")

    user = _get_or_create_user(claims)
    access_token = jwt_service.create_access_token(user["uid"], {"email": user["email"]})
    refresh_token = jwt_service.create_refresh_token(user["uid"])

    return {
        "user": user,
        "tokens": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        },
    }


def refresh_access_token(refresh_token: str) -> dict:
    payload = jwt_service.verify_refresh_token(refresh_token)
    uid = payload["sub"]
    user_list = users_repo.query(filters=[("uid", "==", uid)], limit=1)
    user = user_list[0] if user_list else None
    if not user:
        raise NotFoundError("User associated with this token no longer exists")

    new_access_token = jwt_service.create_access_token(uid, {"email": user.get("email")})
    return {
        "access_token": new_access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


def get_current_user_from_uid(uid: str) -> dict:
    user_list = users_repo.query(filters=[("uid", "==", uid)], limit=1)
    if not user_list:
        raise NotFoundError("User not found")
    return user_list[0]
