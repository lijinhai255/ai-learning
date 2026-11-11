from pydantic import BaseModel, Field, field_validator


class Todo(BaseModel):
    id: int
    title: str
    completed: bool


class CreateTodoRequest(BaseModel):
    title: str = Field(min_length=1, max_length=200)

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("title must not be blank")
        return value
