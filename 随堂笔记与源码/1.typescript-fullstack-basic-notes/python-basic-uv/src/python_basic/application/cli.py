"""命令行适配层：负责参数解析和输出，不承载领域规则。"""

import argparse
from collections.abc import Sequence

from python_basic.application.repository import InMemoryTaskRepository
from python_basic.application.service import TaskNotFoundError, TaskService


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Python 基础任务应用")
    commands = parser.add_subparsers(dest="command", required=True)

    add_parser = commands.add_parser("add", help="创建任务")
    add_parser.add_argument("title")

    commands.add_parser("list", help="列出任务")

    complete_parser = commands.add_parser("complete", help="完成任务")
    complete_parser.add_argument("task_id", type=int)
    return parser


def run(argv: Sequence[str] | None = None, service: TaskService | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    task_service = service or TaskService(InMemoryTaskRepository())

    try:
        if args.command == "add":
            task = task_service.create(args.title)
            print(f"已创建 #{task.id}: {task.title}")
        elif args.command == "list":
            for task in task_service.list():
                status = "✓" if task.completed else " "
                print(f"[{status}] #{task.id}: {task.title}")
        elif args.command == "complete":
            task = task_service.complete(args.task_id)
            print(f"已完成 #{task.id}: {task.title}")
    except (TaskNotFoundError, ValueError) as error:
        parser.error(str(error))
    return 0


def main() -> int:
    return run()
