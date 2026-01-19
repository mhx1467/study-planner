from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import LoginRequest, UserCreate
from app.api.dependency import get_current_user
from app.services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = auth_service.register_user(db, user.email, user.username, user.password)
    return {"message": "User registered successfully", "user_id": db_user.id}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = auth_service.authenticate_user(db, data.email, data.password)
    token = auth_service.generate_access_token(user, 60)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": auth_service.get_user_response(user)
    }

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return auth_service.get_user_response(user)

@router.post("/logout")
def logout(user: User = Depends(get_current_user)):
    """Logout user - clears token on client side"""
    return {"message": "Logged out successfully"}

@router.post("/refresh")
def refresh_token(user=Depends(get_current_user)):
    token = auth_service.generate_access_token(user, 60)
    return {
        "access_token": token,
        "token_type": "bearer"
    }

