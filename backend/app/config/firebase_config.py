"""
Firebase Admin SDK initialization.
Provides a singleton Firestore client used across the application.
Also exposes Firebase Auth verification helpers for Google ID tokens.
"""
import os
import tempfile
import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
from app.config.settings import settings
from app.utils.logger import logger

_firebase_app = None
_firestore_client = None


def _load_credentials():
    """Load Firebase credentials from file, env var (B64), or ADC."""
    cred_path = settings.FIREBASE_CREDENTIALS_PATH

    if os.path.exists(cred_path):
        logger.info("Loading Firebase credentials from file: %s", cred_path)
        return credentials.Certificate(cred_path)

    b64_creds = os.environ.get("FIREBASE_SERVICE_ACCOUNT_B64")
    if b64_creds:
        import base64
        try:
            decoded = base64.b64decode(b64_creds)
            tmp = tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False)
            tmp.write(decoded.decode("utf-8"))
            tmp.close()
            logger.info("Loaded Firebase credentials from FIREBASE_SERVICE_ACCOUNT_B64 env var")
            return credentials.Certificate(tmp.name)
        except Exception as exc:
            logger.warning("Failed to decode FIREBASE_SERVICE_ACCOUNT_B64: %s", exc)

    logger.warning(
        "Firebase service account not found at '%s' and no "
        "FIREBASE_SERVICE_ACCOUNT_B64 env var set. "
        "Falling back to Application Default Credentials.",
        cred_path,
    )
    return None


def init_firebase():
    """Initialize the Firebase Admin app exactly once."""
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    if firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app

    try:
        cred = _load_credentials()
        if cred:
            _firebase_app = firebase_admin.initialize_app(
                cred,
                {
                    "projectId": settings.FIREBASE_PROJECT_ID or None,
                    "storageBucket": settings.FIREBASE_STORAGE_BUCKET or None,
                },
            )
        else:
            _firebase_app = firebase_admin.initialize_app()
    except Exception as exc:
        logger.error(f"Failed to initialize Firebase Admin SDK: {exc}")
        _firebase_app = None
    return _firebase_app


def get_firestore_client():
    """Return a cached Firestore client instance."""
    global _firestore_client
    if _firestore_client is None:
        init_firebase()
        if _firebase_app is not None:
            _firestore_client = firestore.client()
        else:
            raise RuntimeError(
                "Firestore client unavailable: Firebase Admin SDK failed to initialize. "
                "Check FIREBASE_CREDENTIALS_PATH in your .env file."
            )
    return _firestore_client


def get_firebase_auth():
    """Return the firebase_admin.auth module (initializes app if needed)."""
    init_firebase()
    return firebase_auth
