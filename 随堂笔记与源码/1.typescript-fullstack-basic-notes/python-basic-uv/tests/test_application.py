from python_basic.application.repository import InMemoryTaskRepository
from python_basic.application.service import TaskNotFoundError, TaskService


def test_task_service_lifecycle() -> None:
    service = TaskService(InMemoryTaskRepository())
    task = service.create("  学习 Python  ")
    assert task.title == "学习 Python"
    assert task.completed is False

    completed = service.complete(task.id)
    assert completed.completed is True
    assert list(service.list()) == [task]


def test_task_service_rejects_unknown_task() -> None:
    service = TaskService(InMemoryTaskRepository())
    try:
        service.complete(404)
    except TaskNotFoundError as error:
        assert "404" in str(error)
    else:
        raise AssertionError("应当抛出 TaskNotFoundError")


def test_empty_title_is_rejected() -> None:
    service = TaskService(InMemoryTaskRepository())
    try:
        service.create("   ")
    except ValueError as error:
        assert "不能为空" in str(error)
    else:
        raise AssertionError("应当拒绝空标题")
