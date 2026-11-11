"""类型保护：对应 TypeScript 的 ``6.types-guard.ts``。"""

from typing import TypeGuard


def is_number(value: object) -> TypeGuard[int | float]:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def is_string(value: object) -> TypeGuard[str]:
    return isinstance(value, str)


def pad_left(value: str, padding: int | str) -> str:
    if is_number(padding):
        return " " * int(padding) + value
    if is_string(padding):
        return padding + value
    raise TypeError("padding 必须是数字或字符串")


def demo() -> tuple[str, str]:
    return pad_left("hello", 2), pad_left("hello", "say: ")


if __name__ == "__main__":
    print(demo())
