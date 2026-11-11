"""itertools：组合迭代器，适合处理数据流。"""

from itertools import chain, islice


def demo() -> dict[str, list[int]]:
    sequence = list(islice(range(10, 100, 10), 3))
    merged = list(chain([1, 2], [3, 4]))
    return {"sequence": sequence, "merged": merged}


if __name__ == "__main__":
    print(demo())
