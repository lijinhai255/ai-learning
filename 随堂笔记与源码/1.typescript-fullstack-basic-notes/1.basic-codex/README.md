# tsdown 基础 TypeScript 工程

这是一个使用 [tsdown](https://tsdown.dev/) 构建的最小 TypeScript 库项目。

## 环境要求

- Node.js 20+
- npm 10+

## 开发

安装依赖：

```bash
npm install
```

执行类型检查：

```bash
npm run typecheck
```

监听源码并持续构建：

```bash
npm run dev
```

## 构建

```bash
npm run build
```

构建产物位于 `dist/`：

- `index.mjs`：ES Module
- `index.cjs`：CommonJS
- `index.d.mts`、`index.d.cts`：TypeScript 类型声明

## 项目结构

```text
.
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
├── tsdown.config.ts
└── README.md
```
