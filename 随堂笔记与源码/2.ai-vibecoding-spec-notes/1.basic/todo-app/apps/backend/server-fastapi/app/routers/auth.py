import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..entities.user import User
from ..schemas.auth import AuthResponse, LoginPayload, RegisterPayload, UserOut
from ..security import create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


def to_user_out(user: User) -> dict:
    return {"id": user.id, "username": user.username, "createdAt": user.createdAt}


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="用户名已存在")

    hashed = bcrypt.hashpw(payload.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(username=payload.username, password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"token": create_access_token(user), "user": to_user_out(user)}


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if user is None or not bcrypt.checkpw(payload.password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误")

    return {"token": create_access_token(user), "user": to_user_out(user)}


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user
