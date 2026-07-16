"""
Verifies Google OAuth2 ID tokens sent by the client (e.g. from Google Sign-In
on a React/Flutter frontend) using google-auth.
"""
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from app.config.settings import settings
from app.utils.exceptions import AuthenticationError
from app.utils.logger import logger

_google_request = google_requests.Request()


def verify_google_id_token(token: str) -> dict:
    """
    Verify a Google-issued ID token and return the decoded claims.
    Raises AuthenticationError if verification fails.
    """
    try:
        claims = google_id_token.verify_oauth2_token(
            token, _google_request, settings.GOOGLE_CLIENT_ID or None
        )
        if claims.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
            raise ValueError("Invalid token issuer")
        return {
            "uid": claims.get("sub"),
            "email": claims.get("email"),
            "name": claims.get("name") or claims.get("email", "").split("@")[0],
            "picture": claims.get("picture"),
            "email_verified": claims.get("email_verified", False),
        }
    except Exception as exc:  # noqa: BLE001
        logger.warning(f"Google ID token verification failed: {exc}")
        raise AuthenticationError("Invalid Google ID token") from exc
