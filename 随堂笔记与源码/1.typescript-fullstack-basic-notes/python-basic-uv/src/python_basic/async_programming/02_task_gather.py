"""任务并发：create_task 与 gather。"""

import asyncio


async def fetch(value: int) -> int:
    await asyncio.sleep(0)
    return value * value


async def demo() -> list[int]:
    tasks = [asyncio.create_task(fetch(value)) for value in (1, 2, 3)]
    return await asyncio.gather(*tasks)


if __name__ == "__main__":
    print(asyncio.run(demo()))
