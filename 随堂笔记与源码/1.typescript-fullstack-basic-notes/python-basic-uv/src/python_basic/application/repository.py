"""仓储抽象与内存实现。"""

from collections.abc import Iterable
from typing import Protocol

from python_basic.application.domain import Task, TaskId


class TaskRepository(Protocol):
    def add(self, title: str) -> Task: ...

    def get(self, task_id: TaskId) -> Task | None: ...

    def list(self) -> Iterable[Task]: ...


class InMemoryTaskRepository:
    def __init__(self) -> None:
        self._tasks: dict[TaskId, Task] = {}
        self._next_id = 1

    def add(self, title: str) -> Task:
        task = Task(TaskId(self._next_id), title)
        self._tasks[task.id] = task
        self._next_id += 1
        return task

    def get(self, task_id: TaskId) -> Task | None:
        return self._tasks.get(task_id)

    def list(self) -> list[Task]:
        return list(self._tasks.values())
