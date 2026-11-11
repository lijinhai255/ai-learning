# 代码规范（Code Standards）

> 本文件是从妙码协同文档（miaoma-docs）抽取的代码风格与质量规则。

## 1. 格式化（Prettier）

`.prettierrc` 生效配置：

| 配置项 | 值 |
| --- | --- |
| `singleQuote` | `true` |
| `semi` | `false` |
| `tabWidth` | `4` |
| `printWidth` | `140` |
| `arrowParens` | `avoid` |
| `trailingComma` | `es5` |
| `endOfLine` | `lf` |

`.prettierignore`：忽略 `/dist` 与 `*.yaml`。

## 2. Lint（ESLint 9 flat config）

基础层（`eslint.config.js`）：

- extends：`eslint recommended` + `typescript-eslint recommended`
- 规则：`prettier/prettier: error`、`simple-import-sort/imports: error`
- `@typescript-eslint/no-explicit-any: off`（根级放行）

前端 builder（`apps/frontend/builder/**`）：

- 启用 `react-hooks`（recommended）与 `react-refresh/only-export-components`（warn）
- `no-console: error`

后端（`apps/backend/**`）：

- 放行 `explicit-function-return-type`、`explicit-module-boundary-types`、`interface-name-prefix`、`no-explicit-any`
- `no-console: error`

全局 ignores：`dist`、`build`、`**/*.js`、`**/*.mjs`、`**/*.d.ts`、`eslint.config.js`、`commitlint.config.js`

## 3. TypeScript

根级 `tsconfig.json`：

- `strict: true`、`noUncheckedIndexedAccess: true`、`noImplicitReturns`、`noFallthroughCasesInSwitch`
- `isolatedModules`、`declaration`、`sourceMap`、`importHelpers`

客户端 `tsconfig.client.json`：

- `strict`、`noUnusedLocals`、`noUnusedParameters`
- `moduleResolution: bundler`、`jsx: react-jsx`、`noEmit`

服务端 `tsconfig.server.json`：

- `module: commonjs`、`experimentalDecorators`、`emitDecoratorMetadata`
- `strictNullChecks: false`、`noImplicitAny: false`

## 4. 拼写检查（CSpell）

- 命令：`cspell lint --dot --gitignore --color --cache --show-suggestions`（范围 `packages|apps` 下的源码与文档）
- 自定义词典：`.cspell/custom-words.txt`，领域词（`miaoma`、`prosemirror`、`tiptap`、`yjs` 等）统一登记，禁用逐个文件加 ignore
- ignorePaths：`node_modules`、`dist`、`lib`、`docs`、`*.md`、`package.json`

## 5. 文件头版权声明

创建或搬运妙码学院源码文件时，必须保留以下版权头：

```js
/*
 *   Copyright (c) 2024 妙码学院-Heyi
 *   All rights reserved.
 *   妙码学院官方出品，作者 @Heyi，供学员学习使用，可用作练习，可用作美化简历，不可开源。
 */
```

## 6. 导入与命名

- import 排序由 `simple-import-sort` 强制：先外部依赖，后相对路径
- 组件文件 PascalCase；工具/服务文件 camelCase 或小写连字符
- 禁止在业务代码中使用 `console`（调试完必须清理）

## 7. 编辑器约定

- `.vscode/settings.json`：保存时自动执行 `source.fixAll.eslint`
- 推荐扩展：ESLint、Prettier、Code Spell Checker、Stylelint、Error Lens、EditorConfig 等（见 `.vscode/extensions.json`）
