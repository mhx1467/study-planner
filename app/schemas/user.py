from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=100)

class LoginRequest(BaseModel):
    email: str
    password: str    

class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    role: str

    class Config:
        orm_mode = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: Optional[UserOut] = None

class RefreshTokenRequest(BaseModel):
    pass
