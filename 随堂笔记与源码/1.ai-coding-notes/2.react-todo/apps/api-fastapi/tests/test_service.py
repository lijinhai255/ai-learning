from app.service import TodoNotFoundError, TodoService


def test_创建待办会去除首尾空格且默认为未完成() -> None:
    service = TodoService()

    todo = service.create("  write tests  ")

    assert todo.title == "write tests"
    assert todo.completed is False


def test_toggle两次后恢复初始状态() -> None:
    service = TodoService()
    initial_state = service.find_all()[0].completed

    assert service.toggle(1).completed is not initial_state
    assert service.toggle(1).completed is initial_state


def test_操作不存在的待办会抛出领域异常() -> None:
    service = TodoService()

    try:
        service.toggle(999)
    except TodoNotFoundError as error:
        assert str(error) == "Todo 999 not found"
    else:
        raise AssertionError("expected TodoNotFoundError")
