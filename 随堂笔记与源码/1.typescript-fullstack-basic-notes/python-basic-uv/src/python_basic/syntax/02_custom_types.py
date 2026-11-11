"""自定义类型：对应 TypeScript 的 ``2.custom-type.ts``。"""

from dataclasses import dataclass
from typing import Protocol, TypedDict


class User(TypedDict):
    """只描述数据形状，接近 TypeScript 的 type/interface。"""

    name: str
    age: int


@dataclass(slots=True)
class UserRecord:
    """需要行为和数据封装时使用 dataclass 或普通 class。"""

    name: str
    age: int

    def intro(self) -> str:
        return f"{self.name}: {self.age}"


class UserLike(Protocol):
    """Protocol 是结构化类型，类似 TypeScript 的鸭子类型接口。"""

    name: str

    def say(self) -> str: ...


class CUser:
    def __init__(self, name: str) -> None:
        self.name = name

    def say(self) -> str:
        return f"你好，我是 {self.name}。"


def greet(user: UserLike) -> str:
    return user.say()


def demo() -> tuple[User, str, str]:
    user: User = {"name": "heyi", "age": 18}
    record = UserRecord(**user)
    return user, record.intro(), greet(CUser(user["name"]))


if __name__ == "__main__":
    print(demo())
