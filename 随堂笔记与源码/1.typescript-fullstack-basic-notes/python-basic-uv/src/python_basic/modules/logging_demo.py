"""logging：用日志级别和 handler 代替散落的 print。"""

import logging


def get_logger(name: str = "python_basic") -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    return logger


def demo() -> str:
    logger = get_logger("python_basic.modules")
    logger.info("标准库日志示例")
    return logger.name


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")
    print(demo())
