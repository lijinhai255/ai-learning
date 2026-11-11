import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class CreateTodoPayload(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class UpdateTodoPayload(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    completed: bool | None = None
    important: bool | None = None


class TodoOut(BaseModel):
    id: uuid.UUID
    title: str
    completed: bool
    important: bool
    userId: uuid.UUID
    createdAt: datetime
    updatedAt: datetime


class DeleteTodoOut(BaseModel):
    id: uuid.UUID
