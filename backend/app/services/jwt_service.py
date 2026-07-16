"""
JWT creation and verification service for access & refresh tokens.
"""
import datetime
from typing import Optional
from jose import jwt, JWTError
from app.config.settings import settings
from app.utils.exceptions import TokenExpiredError, InvalidTokenError

ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"


def _create_token(subject: str, token_type: str, expires_delta: datetime.timedelta, extra_claims: Optional[dict] = None) -> str:
    now = datetime.datetime.utcnow()
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_access_token(uid: str, extra_claims: Optional[dict] = None) -> str:
    return _create_token(
        uid,
        ACCESS_TOKEN_TYPE,
        datetime.timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES),
        extra_claims,
    )


def create_refresh_token(uid: str) -> str:
    return _create_token(
        uid,
        REFRESH_TOKEN_TYPE,
        datetime.timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError as exc:
        raise TokenExpiredError() from exc
    except JWTError as exc:
        raise InvalidTokenError() from exc


def verify_access_token(token: str) -> dict:
    payload = decode_token(token)
    if payload.get("type") != ACCESS_TOKEN_TYPE:
        raise InvalidTokenError("Token is not an access token")
    return payload


def verify_refresh_token(token: str) -> dict:
    payload = decode_token(token)
    if payload.get("type") != REFRESH_TOKEN_TYPE:
        raise InvalidTokenError("Token is not a refresh token")
    return payload
