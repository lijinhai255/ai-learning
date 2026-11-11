import os
from typing import Annotated

from fastapi import Depends, FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from app.models import CreateTodoRequest, Todo
from app.service import TodoNotFoundError, TodoService

app = FastAPI(title="Todo API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

todo_service = TodoService()


def get_todo_service() -> TodoService:
    return todo_service


TodoServiceDependency = Annotated[TodoService, Depends(get_todo_service)]


@app.exception_handler(TodoNotFoundError)
async def handle_todo_not_found(_: Request, exception: TodoNotFoundError) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={
            "statusCode": status.HTTP_404_NOT_FOUND,
            "code": "TODO_NOT_FOUND",
            "message": str(exception),
        },
    )


@app.exception_handler(RequestValidationError)
async def handle_validation(_: Request, exception: RequestValidationError) -> JSONResponse:
    messages = "; ".join(
        f"{'.'.join(str(part) for part in error['loc'])}: {error['msg']}"
        for error in exception.errors()
    )
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "statusCode": status.HTTP_400_BAD_REQUEST,
            "code": "VALIDATION_ERROR",
            "message": messages,
        },
    )


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "todo-api"}


@app.get("/todos", response_model=list[Todo])
async def find_all(service: TodoServiceDependency) -> list[Todo]:
    return service.find_all()


@app.post("/todos", response_model=Todo, status_code=status.HTTP_201_CREATED)
async def create(request: CreateTodoRequest, service: TodoServiceDependency) -> Todo:
    return service.create(request)


@app.patch("/todos/{todo_id}/toggle", response_model=Todo)
async def toggle(todo_id: int, service: TodoServiceDependency) -> Todo:
    return service.toggle(todo_id)


@app.delete("/todos/{todo_id}", status_code=status.HTTP_200_OK, response_class=Response)
async def remove(todo_id: int, service: TodoServiceDependency) -> Response:
    service.remove(todo_id)
    return Response(status_code=status.HTTP_200_OK)


def run() -> None:
    import uvicorn

    uvicorn.run("app.main:app", host="127.0.0.1", port=int(os.getenv("PORT", "3002")))


if __name__ == "__main__":
    run()
