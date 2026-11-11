"""datetime：使用带时区的时间，避免隐式本地时间。"""

from datetime import UTC, datetime, timedelta


def next_hour(moment: datetime) -> datetime:
    if moment.tzinfo is None:
        raise ValueError("moment 必须携带时区")
    return moment + timedelta(hours=1)


def demo() -> str:
    moment = datetime(2026, 1, 1, 8, 0, tzinfo=UTC)
    return next_hour(moment).isoformat()


if __name__ == "__main__":
    print(demo())
