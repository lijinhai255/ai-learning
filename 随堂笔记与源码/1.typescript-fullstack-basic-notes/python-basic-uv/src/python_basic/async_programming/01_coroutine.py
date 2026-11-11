"""协程基础：async def 定义，await 挂起。"""

import asyncio


async def fetch_value(value: int) -> int:
    await asyncio.sleep(0)
    return value * 2


async def demo() -> int:
    return await fetch_value(21)


if __name__ == "__main__":
    print(asyncio.run(demo()))
