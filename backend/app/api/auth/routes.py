"""
/auth routes: Google login, token refresh, current-user info.
"""
from fastapi import APIRouter, Depends, Request
from app.schemas.auth_schema import GoogleLoginRequest, RefreshTokenRequest, LoginResponse, TokenResponse, UserOut
from app.schemas.common_schema import ResponseModel
from app.services import auth_service
from app.middleware.auth_middleware import get_current_user
from app.middleware.rate_limiter import limiter

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/google", response_model=ResponseModel[LoginResponse])
@limiter.limit("10/minute")
async def google_login(request: Request, payload: GoogleLoginRequest):
    result = auth_service.login_with_google(payload.id_token)
    return ResponseModel(message="Login successful", data=result)


@router.post("/firebase", response_model=ResponseModel[LoginResponse])
@limiter.limit("10/minute")
async def firebase_login(request: Request, payload: GoogleLoginRequest):
    result = auth_service.login_with_firebase(payload.id_token)
    return ResponseModel(message="Login successful", data=result)


@router.post("/refresh", response_model=ResponseModel[TokenResponse])
@limiter.limit("20/minute")
async def refresh_token(request: Request, payload: RefreshTokenRequest):
    result = auth_service.refresh_access_token(payload.refresh_token)
    return ResponseModel(message="Token refreshed", data=result)


@router.get("/me", response_model=ResponseModel[UserOut])
async def get_me(user: dict = Depends(get_current_user)):
    return ResponseModel(message="Current user fetched", data=user)


@router.post("/logout", response_model=ResponseModel)
async def logout(user: dict = Depends(get_current_user)):
    # Stateless JWTs: logout is handled client-side by discarding tokens.
    # For server-side revocation, persist token blacklist in `sessions` collection.
    return ResponseModel(message="Logged out successfully")
