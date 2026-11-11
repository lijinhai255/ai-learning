from itertools import count
from threading import RLock

from app.models import CreateTodoRequest, Todo


class TodoNotFoundError(Exception):
    """目标 Todo 不存在。"""

    def __init__(self, todo_id: int) -> None:
        super().__init__(f"Todo {todo_id} not found")
        self.todo_id = todo_id


class TodoService:
    def __init__(self) -> None:
        self._lock = RLock()
        self._next_id = count(3)
        self._todos: dict[int, Todo] = {}
        self.reset()

    def find_all(self) -> list[Todo]:
        with self._lock:
            return [todo.model_copy() for todo in self._todos.values()]

    def create(self, request: CreateTodoRequest | str) -> Todo:
        title = request.title if isinstance(request, CreateTodoRequest) else request
        with self._lock:
            todo = Todo(id=next(self._next_id), title=title.strip(), completed=False)
            self._todos[todo.id] = todo
            return todo.model_copy()

    def toggle(self, todo_id: int) -> Todo:
        with self._lock:
            todo = self._find(todo_id)
            updated = todo.model_copy(update={"completed": not todo.completed})
            self._todos[todo_id] = updated
            return updated.model_copy()

    def remove(self, todo_id: int) -> None:
        with self._lock:
            if self._todos.pop(todo_id, None) is None:
                raise TodoNotFoundError(todo_id)

    def reset(self) -> None:
        with self._lock:
            self._todos = {
                1: Todo(id=1, title="拆解产品需求", completed=True),
                2: Todo(id=2, title="建立 React + Vue + NestJS 工程", completed=False),
            }
            self._next_id = count(3)

    def _find(self, todo_id: int) -> Todo:
        todo = self._todos.get(todo_id)
        if todo is None:
            raise TodoNotFoundError(todo_id)
        return todo
