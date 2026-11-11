"""类型工具：对应 TypeScript 的 ``5.utils.ts``。

Python 没有直接对应 Pick/Omit 的内置类型，数据投影通常通过 TypedDict、
``Required``/``NotRequired`` 和明确的转换函数表达。
"""

from typing import NotRequired, Required, TypedDict


class User(TypedDict):
    id: int
    name: str
    email: str
    password: str


class UserPatch(TypedDict, total=False):
    id: Required[int]
    name: NotRequired[str]
    email: NotRequired[str]


class IdName(TypedDict):
    id: int
    name: str


def pick_id_name(user: User) -> IdName:
    return {"id": user["id"], "name": user["name"]}


def omit_password(user: User) -> dict[str, object]:
    return {key: value for key, value in user.items() if key != "password"}


def demo() -> tuple[IdName, dict[str, object], UserPatch]:
    user: User = {
        "id": 1,
        "name": "heyi",
        "email": "heyi@example.com",
        "password": "secret",
    }
    patch: UserPatch = {"id": user["id"], "name": "new-name"}
    return pick_id_name(user), omit_password(user), patch


if __name__ == "__main__":
    print(demo())
