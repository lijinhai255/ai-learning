# AGENTS.md — 主规则入口

> 本项目为 Spec Coding 学习仓库，规则基线抽取自妙码学院官方项目「妙码协同文档（miaoma-docs）」。
> 本文件是项目规则的总入口，只收录顶层约束与摘要；细节规则与分层规则统一放在 `specs/` 目录，按需查阅。

## 一、项目定位与约束

### 参考项目

- 参考项目：妙码协同文档（miaoma-docs），妙码学院官方出品，作者 @Heyi
- 定位：基于 Prosemirror 与 Tiptap 实现的类 Notion、飞书文档风格的可扩展协同文本编辑器
- 用途：供学员学习使用，可用作练习、美化简历，**不可开源**
- License：`MiaoMaEdu`；官方站点：<http://www.miaomaedu.com>

### 顶层约束

1. 版权声明：创建或搬运妙码学院源码文件时，必须保留文件头版权注释（Copyright 妙码学院-Heyi，不可开源）
2. `miaoma-docs/` 为参考源码副本，**只读，禁止修改**；所有规范变更只能落在 `AGENTS.md` 与 `specs/`
3. 本仓库为规范抽取与学习笔记，写入内容须可复查、可追溯，来源明确
4. 不写入 API 密钥、个人信息、内部链接与未公开资料；需要配置时使用环境变量名或占位符

## 二、工程化架构总览

- Monorepo：pnpm workspace + Turborepo，包管理器固定 `pnpm@9.12.3`
- 工作区：`packages/*`、`apps/frontend/*`、`apps/backend/*`
- 应用与库：
    - `apps/frontend/web`：Vite + React 18 SPA
    - `apps/frontend/desktop`：Tauri 2 桌面端
    - `apps/backend/server`：NestJS 10 服务端（TypeORM + PostgreSQL + Yjs 协同）
    - `packages/core`：平台无关编辑器核心（Tiptap / ProseMirror，tsup 构建 ESM + dts）
    - `packages/react`、`packages/shadcn`、`packages/shadcn-shared-ui`：React 渲染层与 UI 组件层
- 协同技术：Yjs 13、y-prosemirror、y-websocket、y-postgresql
- 详细架构与模块拓扑见 `specs/engineering-architecture.md`

## 三、核心规范摘要

| 领域 | 要点 | 细节文件 |
| --- | --- | --- |
| 代码规范 | Prettier（单引号 / 无分号 / 4 空格 / 140 列）+ ESLint 9（import 排序、no-console）+ CSpell + TS strict | `specs/code-standards.md` |
| 分层规则 | 前端 services/types/pages 分层；后端 modules/fundamentals 分层；库包 api/schema/blocks 分层 | `specs/layering.md` |
| 提交规范 | Conventional Commits + cz-git emoji + commitlint scope 枚举 + lint-staged + husky 门禁 | `specs/commit-conventions.md` |
| 构建质量 | turbo 任务、tsup 库构建、Docker 编排、spellcheck / typecheck 门禁 | `specs/build-quality.md` |

## 四、specs 索引

- `specs/engineering-architecture.md`：Monorepo 拓扑、技术栈基线、依赖管理、构建命令、部署架构
- `specs/layering.md`：前端 / 后端 / 库包分层与目录规则、命名约定
- `specs/code-standards.md`：Prettier、ESLint、TypeScript、CSpell、版权头、导入与命名
- `specs/commit-conventions.md`：提交格式、类型与 emoji、scope 规则、提交工作流
- `specs/build-quality.md`：根级脚本、turbo / tsup 约定、质量门禁、Docker 编排

## 五、本仓库维护约定

- Markdown 使用 UTF-8、四空格缩进、标题按层级递进不跳级；段落简短，文件名使用小写、数字与连字符
- 每次修改后检查目录、内部链接、图片路径与代码块，并运行 `git diff --check` 检查空白字符
- 本目录尚未初始化 Git 仓库；如需提交，遵循 Conventional Commits，每个提交聚焦单一主题
- 优先使用 `rg` 搜索内容；执行删除、批量修改等危险操作前必须先获得明确确认
