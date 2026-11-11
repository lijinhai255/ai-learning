"""json：在 Python 对象与 JSON 文本之间转换。"""

import json
from dataclasses import asdict, dataclass


@dataclass(slots=True)
class Settings:
    theme: str
    page_size: int


def round_trip(settings: Settings) -> Settings:
    text = json.dumps(asdict(settings), ensure_ascii=False)
    data = json.loads(text)
    return Settings(theme=data["theme"], page_size=data["page_size"])


if __name__ == "__main__":
    print(round_trip(Settings("dark", 20)))
