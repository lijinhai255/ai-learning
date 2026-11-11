# Python 基础与进阶 UV 工程

这是一个面向 TypeScript 学习者的传统 Python 应用开发学习工程。它只使用 Python 标准库，不引入前端、HTTP 服务或后端框架；项目管理和运行统一交给 [UV](https://docs.astral.sh/uv/)。

## 1. 快速开始

需要 Python 3.13+ 和 UV：

```bash
uv sync
uv run pytest
uv run ruff check .
uv run mypy src tests
```

运行命令行任务应用：

```bash
uv run python-basic add "学习 dataclass"
uv run python-basic list
uv run python-basic complete 1
```

每个教学文件都可以独立运行，例如：

```bash
uv run python src/python_basic/syntax/01_types.py
uv run python src/python_basic/async_programming/02_task_gather.py
```

## 2. 工程结构

```text
python-basic-uv/
├── pyproject.toml                 # 项目元数据、UV 依赖组、工具配置
├── src/python_basic/
│   ├── syntax/                    # 与当前 TS src 一一对应的语法主题
│   ├── modules/                   # 常用 Python 标准库
│   ├── async_programming/         # asyncio 协程和并发
│   └── application/               # 传统命令行任务应用
└── tests/                         # pytest 测试
```

`application/` 采用简单的分层方式：

```text
cli（参数与输出）
  ↓
service（用例编排）
  ↓
repository（存储抽象）
  ↓
domain（任务实体与业务规则）
```

这套分层没有引入框架，便于先理解职责边界，再逐步替换存储实现。

## 3. TypeScript ↔ Python 对照

| 当前 TS 示例 | Python 示例 | 重点 |
| --- | --- | --- |
| `1.types.ts` | `syntax/01_types.py` | 基础类型、枚举、`Any`、`object`、`None`、`Never` |
| `2.custom-type.ts` | `syntax/02_custom_types.py` | `TypedDict`、`Protocol`、`dataclass`、普通 class |
| `3.union.ts` | `syntax/03_union.py` | `A \| B` 联合、`TypedDict` 多继承表达字段交集 |
| `4.generic.ts` | `syntax/04_generics.py` | `TypeVar`、泛型函数、泛型类 |
| `5.utils.ts` | `syntax/05_typing_utils.py` | `Required`、`NotRequired`、数据投影和类型别名 |
| `6.types-guard.ts` | `syntax/06_type_guards.py` | `isinstance`、`TypeGuard`、运行时收窄 |
| `7.infer.ts` | `syntax/07_type_inference.py` | `TypeVar` 与 mypy/pyright 的静态推导 |
| `8.annotation.ts` | `syntax/08_decorators.py` | 函数装饰器、类装饰器、`ParamSpec` |

几个重要差异：

- TypeScript 类型会参与编译，Python 类型注解默认不改变运行时行为，需要 mypy 或 pyright 做静态检查。
- Python 没有 TypeScript 那样的 `interface` 关键字；数据结构常用 `TypedDict`，行为契约常用 `Protocol`。
- Python 没有通用的交叉类型运算符；`Protocol` 或 `TypedDict` 多继承是常见表达方式。
- TypeScript 装饰器依赖编译器配置，Python 装饰器本质上是接收并返回函数或类的高阶函数。

## 4. 推荐学习顺序

1. 先阅读 `syntax/01_types.py`～`syntax/04_generics.py`，掌握值、数据结构、函数和泛型。
2. 再阅读 `syntax/05_typing_utils.py`～`syntax/08_decorators.py`，理解静态检查与运行时机制的边界。
3. 用 `modules/` 中的例子熟悉文件路径、序列化、时间、容器、迭代器和日志。
4. 阅读 `async_programming/`，先理解事件循环，再理解任务编排和资源释放。
5. 最后跟读 `application/`，把语法、标准库和分层设计组合成一个可以运行的传统应用。

## 5. UV 工作流

```bash
# 初始化或更新锁文件
uv lock

# 同步开发依赖并创建虚拟环境
uv sync

# 在项目环境中运行任意命令
uv run python -m python_basic
uv run pytest

# 添加开发依赖（示例）
uv add --dev pytest
```

锁文件 `uv.lock` 是可复现环境的一部分，应与 `pyproject.toml` 一起保存。
