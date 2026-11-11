"""类型推断：对应 TypeScript 的 ``7.infer.ts``。

Python 解释器不会像 TypeScript 一样在编译时推导类型；mypy/pyright 会根据
类型注解、泛型和返回值分析出结果。下面的 ``TypeVar`` 是最接近的可复用模式。
"""

from typing import TypeVar


T = TypeVar("T")


def first(items: tuple[T, ...]) -> T:
    if not items:
        raise ValueError("集合不能为空")
    return items[0]


def sum_text(a: str, b: str, c: int, enabled: bool) -> str:
    return a + b if enabled else f"{a}{b}{c}"


def demo() -> tuple[str, bool]:
    first_value = first(("one", "two", "three"))
    return first_value, sum_text("a", "b", 1, True) == "ab"


if __name__ == "__main__":
    print(demo())
