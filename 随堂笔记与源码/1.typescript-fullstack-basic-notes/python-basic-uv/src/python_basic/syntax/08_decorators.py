"""装饰器：对应 TypeScript 的 ``8.annotation.ts``。"""

from collections.abc import Callable
from functools import wraps
from typing import ParamSpec, TypeVar


P = ParamSpec("P")
R = TypeVar("R")


def log_call(function: Callable[P, R]) -> Callable[P, R]:
    """在不侵入原函数的情况下包裹行为，类似方法注解。"""

    @wraps(function)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
        print(f"调用 {function.__name__}")
        return function(*args, **kwargs)

    return wrapper


def register(cls: type[R]) -> type[R]:
    """类装饰器可以在类定义后统一登记、配置或增强类。"""

    setattr(cls, "registered", True)
    return cls


@register
class User:
    def __init__(self, name: str) -> None:
        self.name = name

    @log_call
    def say(self) -> str:
        return f"你好，{self.name}。"


def demo() -> tuple[str, bool]:
    user = User("heyi")
    return user.say(), user.registered


if __name__ == "__main__":
    print(demo())
