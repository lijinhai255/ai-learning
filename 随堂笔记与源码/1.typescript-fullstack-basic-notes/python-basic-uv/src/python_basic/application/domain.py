"""领域模型：只负责任务自身的状态和业务规则。"""

from dataclasses import dataclass
from typing import NewType


TaskId = NewType("TaskId", int)


@dataclass(slots=True)
class Task:
    id: TaskId
    title: str
    completed: bool = False

    def __post_init__(self) -> None:
        self.title = self.title.strip()
        if not self.title:
            raise ValueError("任务标题不能为空")

    def complete(self) -> None:
        self.completed = True
