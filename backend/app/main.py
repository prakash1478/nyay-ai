"""
AI Legal Assistant - FastAPI application entrypoint.

Wires together: CORS, rate limiting, request logging, global exception
handlers, Firebase initialization, static file serving (for generated TTS
audio), and all API routers.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.config.settings import settings
from app.config.firebase_config import init_firebase
from app.middleware.rate_limiter import limiter
from app.middleware.error_handler import register_exception_handlers
from app.middleware.logging_middleware import RequestLoggingMiddleware
from app.utils.logger import logger
from app.database.collections import users_repo

from app.api.auth.routes import router as auth_router
from app.api.chat.routes import router as chat_router
from app.api.document.routes import router as document_router
from app.api.rights.routes import router as rights_router
from app.api.voice.routes import router as voice_router
from app.api.translate.routes import router as translate_router
from app.api.profile.routes import router as profile_router
from app.api.history.routes import router as history_router
from app.api.feedback.routes import router as feedback_router


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        description="Production-ready backend for a multilingual AI Legal Assistant "
                     "(chatbot, document analyzer, know-your-rights, voice, translation).",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # --- Rate limiting ---
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # --- CORS ---
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Request logging ---
    app.add_middleware(RequestLoggingMiddleware)

    # --- Global exception handlers ---
    register_exception_handlers(app)

    # --- Static files (generated TTS audio, etc.) ---
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    app.mount("/static", StaticFiles(directory=settings.UPLOAD_DIR), name="static")

    # --- Routers ---
    prefix = settings.API_V1_PREFIX
    app.include_router(auth_router, prefix=prefix)
    app.include_router(chat_router, prefix=prefix)
    app.include_router(document_router, prefix=prefix)
    app.include_router(rights_router, prefix=prefix)
    app.include_router(voice_router, prefix=prefix)
    app.include_router(translate_router, prefix=prefix)
    app.include_router(profile_router, prefix=prefix)
    app.include_router(history_router, prefix=prefix)
    app.include_router(feedback_router, prefix=prefix)

    @app.get("/", tags=["Health"])
    async def root():
        return {"success": True, "message": f"{settings.APP_NAME} API is running", "docs": "/docs"}

    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"success": True, "status": "healthy", "env": settings.APP_ENV}

    @app.on_event("startup")
    async def on_startup():
        logger.info(f"Starting {settings.APP_NAME} in '{settings.APP_ENV}' mode...")
        try:
            init_firebase()
        except Exception as exc:  # noqa: BLE001
            logger.error(f"Firebase failed to initialize on startup: {exc}")

        try:
            from app.services.rights_service import seed_rights_if_empty
            seed_rights_if_empty()
        except Exception as exc:  # noqa: BLE001
            logger.warning(f"Could not seed rights collection on startup (Supabase may be unavailable): {exc}")

        try:
            users_repo.query(limit=1)
            logger.info("Supabase repository is reachable.")
        except Exception as exc:  # noqa: BLE001
            logger.warning(f"Supabase repository check failed on startup: {exc}")

        logger.info("Startup complete.")

    return app


app = create_app()
