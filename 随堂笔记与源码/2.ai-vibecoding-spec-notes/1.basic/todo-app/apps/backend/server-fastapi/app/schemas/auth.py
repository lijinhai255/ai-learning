import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class RegisterPayload(BaseModel):
    username: str = Field(min_length=3, max_length=20, pattern=r"^[a-zA-Z0-9_]+$")
    password: str = Field(min_length=6, max_length=64)


class LoginPayload(BaseModel):
    username: str = Field(min_length=3, max_length=20)
    password: str = Field(min_length=6, max_length=64)


class UserOut(BaseModel):
    id: uuid.UUID
    username: str
    createdAt: datetime


class AuthResponse(BaseModel):
    token: str
    user: UserOut
