from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import SECRET_KEY, ALGORITHM

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pwd(pwd: str):
    return pwd_context.hash(pwd)

def verify_pwd(pwd, hashed):
    return pwd_context.verify(pwd, hashed)

def create_access_token(data: dict, expires_minutes: int):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
