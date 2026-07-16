"""
Custom application exceptions and a centralized exception -> HTTP mapping.
"""
from fastapi import status


class AppException(Exception):
    """Base application exception."""
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "INTERNAL_ERROR"

    def __init__(self, message: str = "An unexpected error occurred", details: dict | None = None):
        self.message = message
        self.details = details or {}
        super().__init__(message)


class AuthenticationError(AppException):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "AUTHENTICATION_ERROR"

    def __init__(self, message: str = "Authentication failed", details: dict | None = None):
        super().__init__(message, details)


class AuthorizationError(AppException):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "AUTHORIZATION_ERROR"

    def __init__(self, message: str = "You do not have permission to perform this action", details: dict | None = None):
        super().__init__(message, details)


class TokenExpiredError(AuthenticationError):
    error_code = "TOKEN_EXPIRED"

    def __init__(self, message: str = "Token has expired", details: dict | None = None):
        super().__init__(message, details)


class InvalidTokenError(AuthenticationError):
    error_code = "INVALID_TOKEN"

    def __init__(self, message: str = "Invalid token", details: dict | None = None):
        super().__init__(message, details)


class ValidationError(AppException):
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    error_code = "VALIDATION_ERROR"

    def __init__(self, message: str = "Validation failed", details: dict | None = None):
        super().__init__(message, details)


class NotFoundError(AppException):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "NOT_FOUND"

    def __init__(self, message: str = "Resource not found", details: dict | None = None):
        super().__init__(message, details)


class ConflictError(AppException):
    status_code = status.HTTP_409_CONFLICT
    error_code = "CONFLICT"

    def __init__(self, message: str = "Resource conflict", details: dict | None = None):
        super().__init__(message, details)


class RateLimitError(AppException):
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    error_code = "RATE_LIMIT_EXCEEDED"

    def __init__(self, message: str = "Too many requests. Please slow down.", details: dict | None = None):
        super().__init__(message, details)


class UnsupportedFileTypeError(AppException):
    status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
    error_code = "UNSUPPORTED_FILE_TYPE"

    def __init__(self, message: str = "Unsupported file type", details: dict | None = None):
        super().__init__(message, details)


class FileTooLargeError(AppException):
    status_code = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
    error_code = "FILE_TOO_LARGE"

    def __init__(self, message: str = "Uploaded file exceeds the maximum allowed size", details: dict | None = None):
        super().__init__(message, details)


class NonLegalQueryError(AppException):
    status_code = status.HTTP_400_BAD_REQUEST
    error_code = "NON_LEGAL_QUERY"

    def __init__(self, message: str = "This assistant only answers legal questions", details: dict | None = None):
        super().__init__(message, details)


class ExternalServiceError(AppException):
    status_code = status.HTTP_502_BAD_GATEWAY
    error_code = "EXTERNAL_SERVICE_ERROR"

    def __init__(self, message: str = "An external service failed to respond", details: dict | None = None):
        super().__init__(message, details)


class DatabaseError(AppException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "DATABASE_ERROR"

    def __init__(self, message: str = "Database operation failed", details: dict | None = None):
        super().__init__(message, details)
