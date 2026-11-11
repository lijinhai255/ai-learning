"""pathlib：跨平台地处理路径。"""

from pathlib import Path


def describe(path_text: str) -> dict[str, str]:
    path = Path(path_text)
    return {
        "name": path.name,
        "stem": path.stem,
        "suffix": path.suffix,
        "parent": str(path.parent),
    }


if __name__ == "__main__":
    print(describe("notes/python/lesson.py"))
