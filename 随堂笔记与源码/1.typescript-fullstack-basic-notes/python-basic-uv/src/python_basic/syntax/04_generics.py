"""泛型：对应 TypeScript 的 ``4.generic.ts``。"""

from dataclasses import dataclass
from typing import Generic, TypeVar


T = TypeVar("T")
U = TypeVar("U")
V = TypeVar("V")


def get_detail(info: T, info1: U, info2: V) -> tuple[T, U, V]:
    """参数类型被保留到返回值，等价于 TypeScript 的泛型函数。"""

    return info, info1, info2


Id = TypeVar("Id")
Name = TypeVar("Name")


@dataclass(slots=True)
class User(Generic[Id, Name]):
    id: Id
    name: Name

    def intro(self) -> tuple[Id, Name]:
        return self.id, self.name


def demo() -> tuple[tuple[dict[str, str], str, int], tuple[str, str]]:
    values = get_detail({}, "1", 2)
    user = User("1", "heyi")
    return values, user.intro()


if __name__ == "__main__":
    print(demo())
