"""联合与交叉建模：对应 TypeScript 的 ``3.union.ts``。"""

from typing import Literal, TypedDict, overload


class TextBlock(TypedDict):
    type: Literal["text"]
    props: dict[str, str]


class ImageBlock(TypedDict):
    type: Literal["image"]
    props: dict[str, str]


Block = TextBlock | ImageBlock


class Identified(TypedDict):
    id: str


class Named(TypedDict):
    name: str


class IdentifiedAndNamed(Identified, Named):
    """TypedDict 多继承是 Python 中表达字段交集的常见方式。"""


@overload
def render(block: TextBlock) -> str: ...


@overload
def render(block: ImageBlock) -> str: ...


def render(block: Block) -> str:
    if block["type"] == "text":
        return f"文本：{block['props'].get('color', '默认颜色')}"
    return f"图片：{block['props'].get('url', '')}"


def demo() -> tuple[str, IdentifiedAndNamed]:
    block: Block = {"type": "image", "props": {"url": "/tmp/demo.png"}}
    identity: IdentifiedAndNamed = {"id": "1", "name": "示例"}
    return render(block), identity


if __name__ == "__main__":
    print(demo())
