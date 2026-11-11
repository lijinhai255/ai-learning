import pytest
from fastapi.testclient import TestClient

from app.main import app, get_todo_service
from app.service import TodoService


@pytest.fixture
def client() -> TestClient:
    service = TodoService()
    app.dependency_overrides[get_todo_service] = lambda: service
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_健康检查和待办主流程(client: TestClient) -> None:
    health_response = client.get("/health")
    assert health_response.status_code == 200
    assert health_response.json() == {"status": "ok", "service": "todo-api"}

    todos_response = client.get("/todos")
    assert todos_response.status_code == 200
    assert len(todos_response.json()) == 2
    assert todos_response.json()[0]["title"] == "拆解产品需求"

    create_response = client.post(
        "/todos", json={"title": "  验证自动验收  ", "ignored": True}
    )
    assert create_response.status_code == 201
    created = create_response.json()
    assert created["title"] == "验证自动验收"
    assert created["completed"] is False

    toggle_response = client.patch(f"/todos/{created['id']}/toggle")
    assert toggle_response.status_code == 200
    assert toggle_response.json()["completed"] is True

    delete_response = client.delete(f"/todos/{created['id']}")
    assert delete_response.status_code == 200
    assert delete_response.content == b""
    assert len(client.get("/todos").json()) == 2

def test_非法输入和未知待办返回稳定错误(client: TestClient) -> None:
    invalid_response = client.post("/todos", json={"title": ""})
    assert invalid_response.status_code == 400
    assert invalid_response.json()["code"] == "VALIDATION_ERROR"

    blank_response = client.post("/todos", json={"title": "   "})
    assert blank_response.status_code == 400
    assert blank_response.json()["code"] == "VALIDATION_ERROR"

    too_long_response = client.post("/todos", json={"title": "a" * 201})
    assert too_long_response.status_code == 400
    assert too_long_response.json()["code"] == "VALIDATION_ERROR"

    not_found_response = client.patch("/todos/999/toggle")
    assert not_found_response.status_code == 404
    assert not_found_response.json()["code"] == "TODO_NOT_FOUND"

    delete_not_found_response = client.delete("/todos/999")
    assert delete_not_found_response.status_code == 404
    assert delete_not_found_response.json()["code"] == "TODO_NOT_FOUND"
