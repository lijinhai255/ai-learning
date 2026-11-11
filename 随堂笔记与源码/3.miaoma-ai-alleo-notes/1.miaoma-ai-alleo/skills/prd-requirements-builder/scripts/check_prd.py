#!/usr/bin/env python3
"""检查 PRD 是否具备可执行的结构、验收标准、异常流程和范围边界。"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path


REQUIRED_SECTIONS = {
    "文档信息": r"^#{1,3}\s+.*文档信息",
    "背景或问题": r"^#{1,3}\s+.*(背景|问题定义|问题)",
    "目标": r"^#{1,3}\s+.*(目标|成功指标)",
    "范围": r"^#{1,3}\s+.*(范围|非目标|产品边界)",
    "用户": r"^#{1,3}\s+.*(用户|使用场景|用户故事)",
    "功能需求": r"^#{1,3}\s+.*功能需求",
    "异常流程": r"^#{1,3}\s+.*(异常流程|异常场景)",
    "不在本期范围": r"^#{1,3}\s+.*(不在本期范围|本期不做|非目标)",
    "非功能": r"^#{1,3}\s+.*非功能",
    "发布或测试": r"^#{1,3}\s+.*(发布|测试|验收)",
}

REQ_HEADING = re.compile(r"^###\s+([A-Z][A-Z0-9-]*\d+)\b")
HEADING = re.compile(r"^#{1,6}\s+")
GIVEN = re.compile(r"\bGiven\b|给定|前置条件", re.I)
WHEN = re.compile(r"\bWhen\b|当", re.I)
THEN = re.compile(r"\bThen\b|则|应当|应该", re.I)


def section_blocks(lines: list[str]) -> list[tuple[int, str, list[str]]]:
    blocks: list[tuple[int, str, list[str]]] = []
    starts = [(idx, line.rstrip()) for idx, line in enumerate(lines) if HEADING.match(line)]
    for position, (idx, title) in enumerate(starts):
        end = starts[position + 1][0] if position + 1 < len(starts) else len(lines)
        blocks.append((idx + 1, title, lines[idx + 1 : end]))
    return blocks


def has_entry(lines: list[str]) -> bool:
    return any(line.strip().startswith(("-", "*", "|", "1.", "2.")) for line in lines)


def check(path: Path) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    blocks = section_blocks(lines)

    for label, pattern in REQUIRED_SECTIONS.items():
        if not any(re.search(pattern, title, re.I) for _, title, _ in blocks):
            errors.append(f"缺少必需章节：{label}")

    scope_block = next((body for _, title, body in blocks if re.search(r"不在本期范围|本期不做|非目标", title)), None)
    if scope_block is not None and not has_entry(scope_block):
        errors.append("不在本期范围章节没有条目")

    feature_blocks: list[tuple[int, str, list[str]]] = []
    for line_no, title, body in blocks:
        if REQ_HEADING.match(title):
            feature_blocks.append((line_no, title, body))
    if not feature_blocks:
        errors.append("没有检测到带唯一 ID 的三级需求标题，例如 ### AI-001 上下文摘要")

    for line_no, title, body in feature_blocks:
        joined = "\n".join(body)
        if not re.search(r"验收标准|Acceptance Criteria", joined, re.I):
            errors.append(f"{line_no} 行 {title} 缺少验收标准")
        if not re.search(r"异常流程|异常场景|边界情况|错误处理", joined, re.I):
            errors.append(f"{line_no} 行 {title} 缺少异常流程或边界处理")
        if not (GIVEN.search(joined) and WHEN.search(joined) and THEN.search(joined)):
            errors.append(f"{line_no} 行 {title} 的验收标准缺少 Given/When/Then 或给定/当/则")
        if not re.search(r"优先级|P0|P1|P2", joined, re.I):
            warnings.append(f"{line_no} 行 {title} 未明确优先级")
        if not re.search(r"用户故事|作为", joined):
            warnings.append(f"{line_no} 行 {title} 未明确用户故事")

    exception_block = next((body for _, title, body in blocks if re.search(r"异常流程|异常场景", title)), None)
    if exception_block is not None:
        exception_text = "\n".join(exception_block)
        for keyword in ("权限", "加载", "空状态", "网络", "重复", "超时"):
            if keyword not in exception_text:
                warnings.append(f"异常流程矩阵未出现检查项：{keyword}，请确认是否适用")
        if "适用" not in exception_text:
            errors.append("异常流程矩阵需要标明场景是否适用")

    if "待确认" not in text and "开放问题" not in text:
        warnings.append("未发现待确认决策或开放问题章节")

    return errors, warnings


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate a PRD document")
    parser.add_argument("prd", type=Path, help="PRD Markdown file")
    args = parser.parse_args()
    if not args.prd.exists():
        print(f"ERROR 文件不存在：{args.prd}")
        return 2
    try:
        errors, warnings = check(args.prd)
    except UnicodeDecodeError:
        print("ERROR 文件必须使用 UTF-8 编码")
        return 2
    for warning in warnings:
        print(f"WARN {warning}")
    for error in errors:
        print(f"ERROR {error}")
    if errors:
        print(f"FAIL 共发现 {len(errors)} 个错误，{len(warnings)} 个提示")
        return 1
    print(f"PASS PRD 结构校验通过，{len(warnings)} 个提示")
    return 0


if __name__ == "__main__":
    sys.exit(main())
