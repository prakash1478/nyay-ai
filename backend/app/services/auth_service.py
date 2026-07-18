from app.database.collections import users_repo
from app.services import jwt_service
from app.services.google_oauth_service import verify_google_id_token
from app.config.firebase_config import get_firebase_auth
from app.config.settings import settings
from app.utils.exceptions import AuthenticationError, NotFoundError
from app.utils.logger import logger

DEMO_USER_UID = "demo-user"
DEMO_USER_EMAIL = "demo.user@nyaya.ai"
DEMO_USER_NAME = "Demo User"


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


def _provision_user(uid: str, claims: dict) -> dict:
    existing_list = users_repo.query(filters=[("uid", "==", uid)], limit=1)
    existing = existing_list[0] if existing_list else None
    if existing:
        return existing
    user_data = {
        "uid": uid,
        "email": claims.get("email"),
        "name": claims.get("name") or claims.get("email", "").split("@")[0],
        "picture": claims.get("picture"),
        "provider": "firebase",
        "preferred_language": "en",
        "is_active": True,
    }
    created = users_repo.create(user_data)
    logger.info(f"Provisioned new user {uid} ({user_data.get('email')})")
    return created


def _issue_tokens(user: dict) -> dict:
    db_id = user["id"]
    access_token = jwt_service.create_access_token(db_id, {"email": user["email"]})
    refresh_token = jwt_service.create_refresh_token(db_id)
    return {
        "user": user,
        "tokens": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        },
    }


def login_with_firebase(id_token: str) -> dict:
    auth = get_firebase_auth()
    try:
        decoded = auth.verify_id_token(id_token)
    except Exception as exc:
        raise AuthenticationError("Invalid Firebase ID token") from exc
    user = _provision_user(decoded["uid"], decoded)
    return _issue_tokens(user)


def login_with_google(id_token: str) -> dict:
    claims = verify_google_id_token(id_token)
    if not claims.get("email_verified", True):
        raise AuthenticationError("Google email is not verified")

    user = _get_or_create_user(claims)
    return _issue_tokens(user)


def ensure_demo_user() -> dict:
    existing = users_repo.query(filters=[("uid", "==", DEMO_USER_UID)], limit=1)
    if existing:
        return existing[0]

    created = users_repo.create({
        "uid": DEMO_USER_UID,
        "email": DEMO_USER_EMAIL,
        "name": DEMO_USER_NAME,
        "picture": None,
        "provider": "demo",
        "preferred_language": "en",
        "is_active": True,
    })
    logger.info("Provisioned demo user for development mode")
    return created


def refresh_access_token(refresh_token: str) -> dict:
    payload = jwt_service.verify_refresh_token(refresh_token)
    db_id = payload["sub"]
    user = users_repo.get(db_id)
    if not user:
        raise NotFoundError("User associated with this token no longer exists")

    new_access_token = jwt_service.create_access_token(db_id, {"email": user.get("email")})
    return {
        "access_token": new_access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


def get_current_user_from_uid(uid: str) -> dict:
    user = users_repo.get(uid)
    if not user:
        raise NotFoundError("User not found")
    return user
