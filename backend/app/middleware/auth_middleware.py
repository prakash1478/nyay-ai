"""
FastAPI dependency for protecting routes with JWT bearer authentication.
"""
from fastapi import Depends, Header
from app.services import jwt_service
from app.services.auth_service import get_current_user_from_uid
from app.utils.exceptions import AuthenticationError


async def get_bearer_token(authorization: str | None = Header(default=None)) -> str:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise AuthenticationError("Missing or malformed Authorization header. Expected 'Bearer <token>'.")
    return authorization.split(" ", 1)[1].strip()


async def get_current_user(token: str = Depends(get_bearer_token)) -> dict:
    """
    Dependency to be used on protected routes:
        @router.get("/me")
        async def me(user: dict = Depends(get_current_user)): ...
    """
    payload = jwt_service.verify_access_token(token)
    uid = payload.get("sub")
    if not uid:
        raise AuthenticationError("Token payload missing subject")
    user = get_current_user_from_uid(uid)
    return user


async def get_current_uid(token: str = Depends(get_bearer_token)) -> str:
    """Lightweight dependency that only decodes the token without a Firestore round-trip."""
    payload = jwt_service.verify_access_token(token)
    uid = payload.get("sub")
    if not uid:
        raise AuthenticationError("Token payload missing subject")
    return uid
