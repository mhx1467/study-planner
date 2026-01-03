from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.core.security import hash_pwd, verify_pwd, create_access_token
from app.schemas.user import LoginRequest, UserCreate
from app.api.dependency import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    db_user = User(
        email=user.email,
        username=user.username,
        password=hash_pwd(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"message": "User registered successfully", "user_id": db_user.id}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_pwd(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": user.role}, 60)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username
        }
    }

@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    """Get current authenticated user"""
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username
    }

@router.post("/logout")
def logout(user: User = Depends(get_current_user)):
    """Logout user - clears token on client side"""
    return {"message": "Logged out successfully"}

@router.post("/refresh")
def refresh_token(user=Depends(get_current_user)):
    token = create_access_token({"sub": str(user.id), "role": user.role}, 60)
    return {
        "access_token": token,
        "token_type": "bearer"
    }

