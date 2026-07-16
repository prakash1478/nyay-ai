"""
Rate limiting configuration using slowapi (Redis-free, in-memory token bucket
keyed by client IP). Suitable for single-instance deployments; swap the
storage backend for Redis in a multi-instance production setup.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config.settings import settings

limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"])
