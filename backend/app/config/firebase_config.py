"""
Firebase Admin SDK initialization.
Provides a singleton Firestore client used across the application.
Also exposes Firebase Auth verification helpers for Google ID tokens.
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore, auth as firebase_auth
from app.config.settings import settings
from app.utils.logger import logger

_firebase_app = None
_firestore_client = None


def init_firebase():
    """Initialize the Firebase Admin app exactly once."""
    global _firebase_app
    if _firebase_app is not None:
        return _firebase_app

    if firebase_admin._apps:
        _firebase_app = firebase_admin.get_app()
        return _firebase_app

    cred_path = settings.FIREBASE_CREDENTIALS_PATH
    try:
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            _firebase_app = firebase_admin.initialize_app(
                cred,
                {
                    "projectId": settings.FIREBASE_PROJECT_ID or None,
                    "storageBucket": settings.FIREBASE_STORAGE_BUCKET or None,
                },
            )
            logger.info("Firebase Admin SDK initialized with service account credentials.")
        else:
            # Fallback: application default credentials (useful in cloud environments)
            _firebase_app = firebase_admin.initialize_app()
            logger.warning(
                "Firebase service account file not found at '%s'. "
                "Falling back to Application Default Credentials.",
                cred_path,
            )
    except Exception as exc:  # noqa: BLE001
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
