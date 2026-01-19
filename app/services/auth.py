from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_pwd, verify_pwd, create_access_token


def register_user(db: Session, email: str, username: str, password: str):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if db.query(User).filter(User.username == username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    db_user = User(
        email=email,
        username=username,
        password=hash_pwd(password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_pwd(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user


def generate_access_token(user: User, expires_in_minutes: int = 60):
    token = create_access_token({"sub": str(user.id), "role": user.role}, expires_in_minutes)
    return token


def get_user_response(user: User):
    return {
        "id": user.id,
        "email": user.email,
        "username": user.username
    }
