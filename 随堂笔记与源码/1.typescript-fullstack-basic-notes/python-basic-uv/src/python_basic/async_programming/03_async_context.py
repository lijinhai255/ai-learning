"""异步上下文管理器：对应需要异步释放资源的场景。"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager


@asynccontextmanager
async def resource(name: str) -> AsyncIterator[str]:
    print(f"打开资源：{name}")
    try:
        yield name
    finally:
        print(f"关闭资源：{name}")


async def demo() -> str:
    async with resource("demo") as opened:
        return opened


if __name__ == "__main__":
    import asyncio

    print(asyncio.run(demo()))
