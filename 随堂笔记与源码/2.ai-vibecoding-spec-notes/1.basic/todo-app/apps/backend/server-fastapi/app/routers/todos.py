import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..entities.todo import Todo
from ..entities.user import User
from ..schemas.todo import CreateTodoPayload, DeleteTodoOut, TodoOut, UpdateTodoPayload
from ..security import get_current_user

router = APIRouter(prefix="/api/todos", tags=["todos"])


def to_todo_out(todo: Todo) -> dict:
    return {
        "id": todo.id,
        "title": todo.title,
        "completed": todo.completed,
        "important": todo.important,
        "userId": todo.userId,
        "createdAt": todo.createdAt,
        "updatedAt": todo.updatedAt,
    }


def get_owned_todo(db: Session, user: User, todo_id: uuid.UUID) -> Todo:
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.userId == user.id).first()
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo 不存在")
    return todo


@router.get("", response_model=list[TodoOut])
def list_todos(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return (
        db.query(Todo)
        .filter(Todo.userId == user.id)
        .order_by(Todo.createdAt.desc())
        .all()
    )


@router.post("", response_model=TodoOut, status_code=status.HTTP_201_CREATED)
def create_todo(
    payload: CreateTodoPayload,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    todo = Todo(title=payload.title, userId=user.id)
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@router.patch("/{todo_id}", response_model=TodoOut)
def update_todo(
    todo_id: uuid.UUID,
    payload: UpdateTodoPayload,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    todo = get_owned_todo(db, user, todo_id)

    if payload.title is not None:
        todo.title = payload.title
    if payload.completed is not None:
        todo.completed = payload.completed
    if payload.important is not None:
        todo.important = payload.important

    db.commit()
    db.refresh(todo)
    return todo


@router.delete("/{todo_id}", response_model=DeleteTodoOut)
def delete_todo(
    todo_id: uuid.UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    todo = get_owned_todo(db, user, todo_id)
    db.delete(todo)
    db.commit()
    return {"id": todo_id}
