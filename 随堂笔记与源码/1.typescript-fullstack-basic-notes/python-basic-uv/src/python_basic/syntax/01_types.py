"""Python 类型基础：对应 TypeScript 的 ``1.types.ts``。

Python 的类型注解主要服务于静态检查工具，运行时仍然是动态语言。
``None`` 通常对应 TypeScript 的 ``null``，Python 没有 ``undefined``。
"""

from enum import Enum
from typing import Any, Final, Never


class Color(Enum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"


IS_DONE: bool = True
COUNT: int = 42
NAME: str = "Python"
NUMBERS: list[int] = [1, 2, 3]
PAIR: tuple[str, int] = ("hello", 10)
CURRENT_COLOR: Color = Color.GREEN

# Any 相当于放弃这一个值的静态检查；object 才是更安全的顶级类型。
UNKNOWN_VALUE: Any = 4
SAFE_UNKNOWN: object = 4
NO_RETURN_VALUE: None = None
CONSTANT: Final[str] = "学习示例"


def fail(message: str) -> Never:
    """标记一个永远不会正常返回的函数，对应 TypeScript 的 never。"""

    raise ValueError(message)


def demo() -> dict[str, object]:
    """返回基础类型示例，方便测试和交互式查看。"""

    return {
        "is_done": IS_DONE,
        "count": COUNT,
        "name": NAME,
        "numbers": NUMBERS,
        "pair": PAIR,
        "color": CURRENT_COLOR.value,
        "unknown": SAFE_UNKNOWN,
        "empty": NO_RETURN_VALUE,
        "constant": CONSTANT,
    }


if __name__ == "__main__":
    print(demo())
