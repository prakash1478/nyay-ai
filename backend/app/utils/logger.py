"""
Centralized logging configuration using loguru.
Writes structured logs to both console and rotating log files.
"""
import sys
import os
from loguru import logger as _logger

try:
    from app.config.settings import settings
    LOG_LEVEL = settings.LOG_LEVEL
    LOG_DIR = settings.LOG_DIR
except Exception:
    LOG_LEVEL = "INFO"
    LOG_DIR = "logs"

os.makedirs(LOG_DIR, exist_ok=True)

_logger.remove()
_logger.add(
    sys.stdout,
    level=LOG_LEVEL,
    colorize=True,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | "
           "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
)
_logger.add(
    os.path.join(LOG_DIR, "app.log"),
    level=LOG_LEVEL,
    rotation="10 MB",
    retention="14 days",
    compression="zip",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
)
_logger.add(
    os.path.join(LOG_DIR, "errors.log"),
    level="ERROR",
    rotation="10 MB",
    retention="30 days",
    compression="zip",
)

logger = _logger
