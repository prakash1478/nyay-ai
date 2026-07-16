"""
HTTP request/response logging middleware.
"""
import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from app.utils.logger import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())[:8]
        start_time = time.time()
        logger.info(f"[{request_id}] --> {request.method} {request.url.path}")
        try:
            response = await call_next(request)
        except Exception as exc:  # noqa: BLE001
            duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(f"[{request_id}] <-- ERROR after {duration_ms}ms: {exc}")
            raise
        duration_ms = round((time.time() - start_time) * 1000, 2)
        logger.info(f"[{request_id}] <-- {response.status_code} ({duration_ms}ms)")
        response.headers["X-Request-ID"] = request_id
        return response
