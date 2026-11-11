"""应用服务：编排用例，不关心具体存储实现。"""

from collections.abc import Iterable

from python_basic.application.domain import Task, TaskId
from python_basic.application.repository import TaskRepository


class TaskNotFoundError(LookupError):
    """请求的任务不存在。"""


class TaskService:
    def __init__(self, repository: TaskRepository) -> None:
        self._repository = repository

    def create(self, title: str) -> Task:
        return self._repository.add(title)

    def complete(self, task_id: int) -> Task:
        task = self._repository.get(TaskId(task_id))
        if task is None:
            raise TaskNotFoundError(f"任务不存在：{task_id}")
        task.complete()
        return task

    def list(self) -> Iterable[Task]:
        return self._repository.list()
