"""collections：Counter、defaultdict、deque 等专用容器。"""

from collections import Counter, defaultdict, deque


def demo() -> dict[str, object]:
    counts = Counter("banana")
    grouped: defaultdict[str, list[int]] = defaultdict(list)
    for number in range(4):
        grouped["even" if number % 2 == 0 else "odd"].append(number)
    queue = deque(["first", "second"])
    queue.append("third")
    return {"most_common": counts.most_common(2), "grouped": dict(grouped), "queue": list(queue)}


if __name__ == "__main__":
    print(demo())
