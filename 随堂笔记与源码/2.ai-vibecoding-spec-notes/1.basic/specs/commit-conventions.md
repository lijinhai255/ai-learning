# Git 提交规范（Commit Conventions）

> 本文件是从妙码协同文档（miaoma-docs）抽取的提交与分支规则。

## 1. 提交格式

遵循 Conventional Commits（`cz-git` 扩展），统一格式：

```
<type>(<scope>): <emoji> <subject>
```

实际示例（来自项目历史）：

```
feat(web): ✨ ai-powered content generation
fix(server): 🐛 fix yjs xml mention collect file name
ci(project): 🎡 remove caddy config
feat(desktop): ✨ add a tauri-based desktop packaging project
```

## 2. 类型与 Emoji

| type | emoji | 含义 |
| --- | --- | --- |
| `feat` | ✨ | 新增功能 |
| `fix` | 🐛 | 缺陷修复 |
| `docs` | 📝 | 仅文档变更 |
| `style` | 💄 | 不影响代码含义的格式调整 |
| `refactor` | 📦️ | 重构（非修 bug、非加功能） |
| `perf` | 🚀 | 性能优化 |
| `test` | 🚨 | 补充或修正测试 |
| `build` | 🛠 | 构建系统或外部依赖变更 |
| `ci` | 🎡 | CI 配置与脚本变更 |
| `chore` | 🔨 | 其他不修改 src/test 的变更 |
| `revert` | ⏪️ | 回滚提交 |

## 3. Scope 规则

- `commitlint.config.js` 通过 `fast-glob` 自动枚举 `packages/`、`apps/`、`apps/frontend/`、`apps/backend/`、`demos/` 下的一级目录作为 scope
- 固定 scope：`docs`、`project`、`style`、`ci`、`dev`、`deploy`、`other`
- 规则 `scope-enum: [2, always, scopes]`，未知 scope 直接拒绝提交

## 4. 提交工作流

- `pnpm commit` → commitizen + `cz-git` 交互式引导（类型、scope、subject、body、破坏性变更、issue）
- husky `pre-commit` 门禁：

```bash
npx lint-staged && pnpm spellcheck && pnpm typecheck
```

- `lint-staged`（见根 `package.json`）：

| 文件 | 处理 |
| --- | --- |
| `*.{ts,tsx}` | `eslint --fix` + `prettier --write` |
| `*.{js,jsx}` | `eslint --fix` + `prettier --write` |
| `*.{css,less}` | `prettier --write` |
| `*.{md,json}` | `prettier --write` |

## 5. 分支与破坏性变更

- 主分支为 `main`，以 scope 标注变更归属，不强制多分支流程
- 破坏性变更（`isBreaking`）必须填写 body，`BREAKING CHANGE` 需要较长说明
- issue 关联使用 `fix #123`、`re #123` 格式
