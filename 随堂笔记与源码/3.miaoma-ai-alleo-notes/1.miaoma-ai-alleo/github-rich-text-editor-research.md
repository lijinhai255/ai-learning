# 飞书文档类富文本编辑器开源项目调研

> 调研时间：2026-09-19（北京时间）  
> 统计口径：Stars 使用 GitHub REST API 的 `stargazers_count` 字段；Stars 会持续变化，以下数字是本次抓取快照。  
> 目标：为“类似飞书文档”的文档型工具选择编辑器内核、协作协议、数据层与产品架构。

## 1. 结论先行

如果目标是快速做出 Web 版 MVP，建议采用：

```text
React + Vite
       │
BlockNote 或 Tiptap/ProseMirror
       │
Yjs + Hocuspocus/WebSocket
       │
NestJS/Koa API + PostgreSQL + Redis + S3/兼容对象存储
       │
全文检索、权限、评论、版本、通知、审计
```

选型建议：

- **最快得到 Notion/飞书式块编辑体验**：BlockNote。它已经把块模型、拖拽、Slash 菜单、React UI 和协作接入点组合好。
- **需要高度定制编辑器和长期扩展能力**：Tiptap + ProseMirror。编辑器核心无 UI，适合建立自己的设计系统和交互层。
- **需要成熟的企业级编辑能力**：CKEditor 5。其 MVC、自定义数据模型、插件体系、评论/修订/协作能力完整，但商业许可和云服务边界需要提前评估。
- **需要完整的知识库产品参考**：Outline、AFFiNE、AppFlowy。它们对文档树、权限、同步、搜索、桌面端和本地优先的处理，比单独研究编辑器更有参考价值。
- **需要研究实时协作和版本历史**：Etherpad。它的作者归属、逐次修订和时间轴是很好的产品机制参考，但数据模型更偏线性文本，不适合作为块式文档的唯一内核。

## 2. 项目总览与 Stars

| 项目 | 类型 | Stars | 主要语言 | 适合参考的部分 | 许可证/注意点 |
|---|---|---:|---|---|---|
| [AFFiNE](https://github.com/toeverything/AFFiNE) | 产品级知识工作空间 | 72,758 | TypeScript | 本地优先、文档/画布/表格融合、块编辑器、跨平台 | 仓库使用自有许可文件，商用前应审阅 `LICENSE` 与各子包许可 |
| [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) | 产品级 Notion 替代品 | 76,832 | Dart | Flutter 跨平台、Rust 数据层、文档/数据库/任务融合 | AGPL-3.0，闭源商用集成需进行许可证评估 |
| [Outline](https://github.com/outline/outline) | 团队知识库产品 | 40,616 | TypeScript | 文档树、权限、认证、搜索、评论、ProseMirror 编辑器 | BSL 1.1，需按条款评估使用方式 |
| [Tiptap](https://github.com/ueberdosis/tiptap) | Headless 编辑器框架 | 38,443 | TypeScript | ProseMirror 封装、扩展体系、React/Vue 接入、协作扩展 | MIT；部分 Pro 扩展和云服务为商业能力 |
| [Etherpad](https://github.com/ether/etherpad) | 实时协作文档产品 | 18,553 | TypeScript/JavaScript | 实时编辑、作者颜色、逐次修订、时间轴、插件系统 | Apache-2.0 |
| [BlockNote](https://github.com/TypeCellOS/BlockNote) | Notion 风格块编辑器 | 10,195 | TypeScript | 块模型、拖拽、Slash 菜单、开箱即用 React UI | 主体 MPL-2.0；`xl-*` 包为 GPL-3.0 |
| [CKEditor 5](https://github.com/ckeditor/ckeditor5) | 企业级编辑器框架 | 10,497 | JavaScript/TypeScript | MVC、模型/视图转换、插件、表格、评论、修订、导出 | GPL-2.0-or-later 或商业许可双许可 |

## 3. 逐项目分析

### 3.1 AFFiNE：产品架构最接近“文档 + 画布”的下一代工作空间

**产品定位**  
README 将 AFFiNE 定义为 Notion 与 Miro 的开源替代品，强调本地优先、实时协作、文档、白板、数据库视图和 AI。其底层编辑器是独立的 [BlockSuite](https://github.com/toeverything/blocksuite) 生态。

**核心依赖与运行时**

- 包管理：Yarn 4；Node `>=22.12.0 <23.0.0`；仓库是 TypeScript monorepo。
- 前端：React 19、Vite、Jotai、Lit、RxJS、React Router、Radix UI、Vanilla Extract。
- 编辑器与同步：`@blocksuite/*`、`yjs`、`y-protocols`；AFFiNE README 同时列出 BlockSuite、y-octo、OctoBase、Yjs、NAPI-RS。
- 桌面端：Electron；原生/高性能能力通过 Rust 与 Node-API/NAPI-RS 接入。
- 服务端：NestJS、Apollo GraphQL、Prisma、Socket.IO、ioredis；支持 S3 兼容存储与 OpenTelemetry。
- 工程质量：Playwright、Vitest、ESLint/Oxlint、SWC、TypeScript、Husky。

**架构判断**

```text
React/Electron 客户端
  ├─ BlockSuite：块/画布/文档编辑器
  ├─ Jotai/Signals：客户端状态
  ├─ Yjs/y-octo：本地优先与 CRDT 同步
  └─ NAPI-RS/Rust：高性能本地能力
          ↓
NestJS + GraphQL + Socket.IO
  ├─ Prisma：业务元数据与权限
  ├─ Redis：缓存、队列、实时协作辅助
  └─ S3：附件与大对象
```

**对你的项目的启发**

- 适合借鉴“所有内容都是可组合 Block”的产品模型，而不是把文档只看成 HTML 字符串。
- 文档和白板共享 Block/页面实体，能支持嵌入、双向链接、数据库视图与画布拖拽。
- 本地优先会显著提高离线能力，但会增加冲突合并、数据迁移、端到端测试和服务端状态治理的复杂度。

关键来源：[README](https://github.com/toeverything/AFFiNE/blob/canary/README.md)、[前端核心 package.json](https://github.com/toeverything/AFFiNE/blob/canary/packages/frontend/core/package.json)、[服务端 package.json](https://github.com/toeverything/AFFiNE/blob/canary/packages/backend/server/package.json)。

### 3.2 AppFlowy：Flutter + Rust 的跨平台、本地优先路线

**产品定位**  
AppFlowy 是 Notion 的开源替代品，覆盖文档、Wiki、数据库、任务和 AI。它不是纯 Web 编辑器，而是跨桌面/移动端的完整产品。

**核心依赖与运行时**

- 客户端：Flutter 3.27+、Dart 3.3+；桌面目标包含 macOS、Windows、Linux，并持续扩展移动端和 Web。
- UI/状态：`flutter_bloc`、`bloc`、`provider`、`get_it`、`go_router`、`freezed`、`json_serializable`。
- 编辑器：`appflowy_editor`、`appflowy_editor_plugins`，另外有独立的 board、popover、UI 等本地包。
- 本地存储和平台能力：Hive、SQLite 相关包、`path_provider`、`permission_handler`、窗口管理、文件拖放、剪贴板、通知。
- Rust workspace：`flowy-document`、`flowy-folder`、`flowy-database2`、`flowy-search`、`flowy-storage`、`flowy-user` 等模块。
- Rust 核心依赖：Tokio、Serde、Diesel/SQLite、UUID、`yrs`、AppFlowy Collab 的 `collab-document`/`collab-database`/`collab-folder`、Tantivy、Protobuf、`client-api`。

**架构判断**

```text
Flutter UI
  ├─ workspace / document / database / task feature modules
  ├─ BLoC + Provider + GetIt
  └─ appflowy_editor
          ↓ FFI
Rust domain/data layer
  ├─ document / folder / database / user / search
  ├─ SQLite + Diesel
  ├─ yrs + AppFlowy Collab：CRDT 与同步
  └─ Tantivy：本地搜索
```

**对你的项目的启发**

- 如果产品从第一天就要求桌面端、离线、本地数据库和跨端一致性，AppFlowy 的分层值得参考。
- 如果先做 Web SaaS，这套 Flutter/Rust 组合会带来更高的人才和构建成本；可以先把其“文档/文件夹/协作域模型”抽象出来，暂不照搬客户端技术栈。

关键来源：[README](https://github.com/AppFlowy-IO/AppFlowy/blob/main/README.md)、[Flutter pubspec.yaml](https://github.com/AppFlowy-IO/AppFlowy/blob/main/frontend/appflowy_flutter/pubspec.yaml)、[Rust workspace Cargo.toml](https://github.com/AppFlowy-IO/AppFlowy/blob/main/frontend/rust-lib/Cargo.toml)。

### 3.3 Outline：团队知识库的完整 SaaS 参考

**产品定位**  
Outline 是面向团队的实时协作知识库，前端和后端都使用 TypeScript。它的架构文档明确区分 React 前端、Koa 后端和共享编辑器代码。

**核心依赖与运行时**

- 前端：React、Vite、MobX、Styled Components、React Router、Radix UI、React DnD、虚拟列表组件。
- 编辑器：ProseMirror 全套核心包，包括 `prosemirror-model`、`state`、`view`、`transform`、`history`、`tables`、`markdown`、`schema-list`、`keymap` 等。
- 协作：Yjs、`y-prosemirror`、`y-protocols`、Hocuspocus provider/server、Redis 扩展。
- 后端：Koa、Sequelize、PostgreSQL（`pg`）、Redis（`ioredis`）、Bull/Bull Board、Socket.IO。
- 文件和导出：AWS S3 SDK、Mammoth、PDF/图片相关包、Markdown-it、Mermaid、KaTeX。
- 认证与集成：Passport、Google/Slack/Azure OAuth、WebAuthn、GitHub/Notion/Linear 等 SDK。
- 可观测性：Sentry、Datadog `dd-trace`、日志与指标工具。

**架构判断**

```text
React/Vite
  ├─ app/editor：编辑器和场景组件
  ├─ MobX models/stores：客户端状态与数据获取
  └─ routes/scenes：页面和异步分包
          ↓ API / WebSocket
Koa API
  ├─ Sequelize models + migrations
  ├─ policies：权限策略
  ├─ queues/processors：Bull + Redis 异步任务
  ├─ services：API、worker、协作服务
  └─ shared/editor：共享 ProseMirror 逻辑
          ↓
PostgreSQL + Redis + S3
```

**对你的项目的启发**

- 这是最适合借鉴“团队知识库产品骨架”的仓库：文档树、收藏、权限、认证、导入导出、后台任务和集成都比较完整。
- 它把编辑器逻辑放在 `shared/editor`，有利于 SSR、服务端转换、导出和测试复用。
- 权限应作为领域策略层存在，不要散落在 React 页面或 API controller 内。

关键来源：[架构文档](https://github.com/outline/outline/blob/main/docs/ARCHITECTURE.md)、[package.json](https://github.com/outline/outline/blob/main/package.json)。

### 3.4 Tiptap：最适合作为 Web 产品的编辑器内核

**产品定位**  
Tiptap 是无 UI、框架无关、扩展驱动的富文本编辑器，底层基于 ProseMirror。它把编辑器核心、节点/标记扩展、React/Vue 绑定和协作扩展拆成多包。

**核心依赖与运行时**

- 包管理：pnpm 11；Node `>=24`；TypeScript monorepo。
- 核心：`@tiptap/core`、`@tiptap/pm`（ProseMirror 封装）、`@tiptap/extensions`。
- 内容能力：heading、paragraph、list、table、image、link、code-block、mention、emoji、mathematics、markdown、HTML 等扩展包。
- UI 接入：`@tiptap/react`、`@tiptap/vue`、React/Vue 的 menu、drag handle、floating menu。
- 协作：`@tiptap/extension-collaboration`、`@tiptap/extension-collaboration-caret`、`@tiptap/y-tiptap`、Yjs；官方推荐 Hocuspocus 作为协作后端。
- 工程：Vite、Webpack、Playwright、Testing Library、Vitest、Changesets。

**架构判断**

```text
Editor
  ├─ ProseMirror schema / state / transaction / view
  ├─ Tiptap extensions：节点、Mark、命令、输入规则
  ├─ Framework adapter：React/Vue/Vanilla
  └─ Collaboration extension：Yjs document + awareness
```

**对你的项目的启发**

- 最适合把“编辑器内核”和“飞书式产品 UI”解耦：工具栏、Slash 菜单、块拖拽、评论侧栏、版本页都由产品层掌控。
- 应先定义自己的文档 JSON、版本兼容策略和扩展注册规范，再把 Tiptap schema 作为实现细节。
- 需要注意 Tiptap 的 Pro 扩展、内容 AI、云服务并不等同于 MIT 核心包的全部能力。

关键来源：[README](https://github.com/ueberdosis/tiptap/blob/main/README.md)、[core package.json](https://github.com/ueberdosis/tiptap/blob/main/packages/core/package.json)、[collaboration package.json](https://github.com/ueberdosis/tiptap/blob/main/packages/extension-collaboration/package.json)。

### 3.5 BlockNote：最快获得 Notion 风格块编辑器

**产品定位**  
BlockNote 是建立在 ProseMirror 和 Tiptap 之上的 React 块编辑器，强调直接嵌入、良好的默认 UI 和 Notion 风格交互。

**核心依赖与运行时**

- 包管理：pnpm 11；workspace 包含 core、react、主题、示例、文档和测试。
- 核心：`@blocknote/core` + `@tiptap/core`/`@tiptap/pm` + ProseMirror model/state/view/transform/table。
- 交互：`@blocknote/react`、`@floating-ui/react`、emoji-mart、输入规则、代码高亮。
- 协作：Yjs、`y-prosemirror`、`y-protocols` 作为 peer dependency，方便按需接入。
- 服务端：`@blocknote/server-util`、JSDOM、Yjs，用于服务端渲染或转换。
- 工程：React 18/19、Vite、Vitest、Playwright、TypeScript、ESLint/Oxlint。

**架构判断**

```text
BlockNoteView
  ├─ @blocknote/react：React 组件和 UI
  ├─ @blocknote/core：BlockSchema、命令、菜单、序列化
  ├─ Tiptap/ProseMirror：文本编辑和 transaction
  └─ Yjs 可选：实时协作
```

**对你的项目的启发**

- 适合 MVP：块 ID、嵌套、拖拽、Slash 菜单、占位符和默认样式已经具备。
- 需要验证其数据模型是否覆盖你的“表格、数据库、页面引用、评论、权限水印、审计”需求；这些通常仍需要产品层自建。
- 许可证要按包审计：主体 MPL-2.0，`xl-*` 包为 GPL-3.0。

关键来源：[README](https://github.com/TypeCellOS/BlockNote/blob/main/README.md)、[core package.json](https://github.com/TypeCellOS/BlockNote/blob/main/packages/core/package.json)、[react package.json](https://github.com/TypeCellOS/BlockNote/blob/main/packages/react/package.json)。

### 3.6 CKEditor 5：成熟的企业级编辑框架

**产品定位**  
CKEditor 5 是基于 MVC、自定义数据模型和虚拟 DOM 的模块化编辑器框架，强调 WYSIWYG、插件、协作、评论、修订、媒体和导出能力。

**核心依赖与运行时**

- 包管理：pnpm 11；JavaScript/TypeScript 多包 monorepo。
- 核心层：`@ckeditor/ckeditor5-core`、`engine`、`utils`、`ui`、`widget`。
- 编辑器外壳：classic、balloon、inline、decoupled、multi-root 等编辑器包。
- 功能插件：basic styles、lists、tables、images、upload、find/replace、source editing、markdown GFM、paste from office、word count、mention、emoji、page break。
- 框架集成：React、Vue、Angular；云服务包提供协作相关能力。
- 工程：Vite、Vitest、Puppeteer、ESBuild、TypeScript、SVGO、Sharp。

**架构判断**

```text
Model（规范化文档模型）
        ↕ conversion
View（编辑视图/虚拟 DOM）
        ↕ controller / commands
Plugins（表格、图片、评论、修订、导出、协作）
```

**对你的项目的启发**

- CKEditor 的模型/视图转换思路适合处理“同一份内容导出 HTML、Markdown、Word、PDF”的场景。
- 多根编辑器、评论、修订和限制编辑等能力，适合企业文档，但需要较强的编辑器工程能力。
- 许可证不是纯 MIT：需要在产品商业模式确定后，逐项确认 GPL 或商业许可边界。

关键来源：[README](https://github.com/ckeditor/ckeditor5/blob/master/README.md)、[ckeditor5 package.json](https://github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5/package.json)、[core package.json](https://github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5-core/package.json)。

### 3.7 Etherpad：实时协作、作者归属和版本时间轴的参考样本

**产品定位**  
Etherpad 是成熟的实时协作文档产品，核心体验包括每次编辑的作者归属、作者颜色、完整修订历史和可拖动时间轴；它支持大量插件和自部署。

**核心依赖与运行时**

- Node `>=24`、pnpm；后端核心包为 `ep_etherpad-lite`。
- Web 层：Express 5、Socket.IO、Express session、JWT/OIDC、OpenAPI。
- 数据层：UeberDB 抽象，支持 PostgreSQL、MySQL、MongoDB、Redis、Cassandra、RethinkDB、MSSQL 等后端。
- 文档和导出：jsdom、htmlparser2、rehype、Mammoth、PDFKit、HTML-to-DOCX。
- 平台能力：插件管理器、限流、日志、指标、邮件、国际化。
- 前端：Vite UI；管理端使用 React、TanStack Query、React Router、Zustand。

**架构判断**

```text
浏览器编辑器
  ├─ Socket.IO：实时增量广播
  ├─ 作者身份和颜色
  └─ Timeslider：按修订回放
          ↓
Express API + plugin hooks
          ↓
UeberDB 统一存储接口
  ├─ PostgreSQL / MySQL / MongoDB / Redis ...
  └─ pad 内容、作者、修订、附件
```

**对你的项目的启发**

- “作者归属 + 逐次修订 + 时间轴”可以作为飞书文档审计、法务留痕和协作透明度的产品差异点。
- Etherpad 的线性 pad 模型不适合直接承载复杂块树、嵌套页面和数据库视图，更适合作为协作历史机制的参考。

关键来源：[README](https://github.com/ether/etherpad/blob/develop/README.md)、[核心 package.json](https://github.com/ether/etherpad/blob/develop/src/package.json)。

## 4. 跨项目依赖与能力对照

| 能力 | AFFiNE | AppFlowy | Outline | Tiptap | BlockNote | CKEditor 5 | Etherpad |
|---|---|---|---|---|---|---|---|
| 块级文档模型 | 强 | 强 | 中 | 需自建 | 强 | 可扩展 | 弱/线性 |
| 开箱即用编辑 UI | 强 | 强 | 强 | 弱 | 强 | 强 | 强 |
| ProseMirror/Tiptap | BlockSuite 自有栈 | AppFlowy Editor | ProseMirror | 核心 | 底层 | 自有模型 | 自有实现 |
| CRDT 协作 | Yjs/y-octo | yrs/Collab | Yjs/Hocuspocus | Yjs/Hocuspocus | 可选 Yjs | 商业/云协作能力 | 实时增量/修订 |
| 本地优先 | 强 | 强 | 弱 | 需自建 | 需自建 | 需自建 | 自部署 |
| 文档树/权限/知识库 | 强 | 强 | 强 | 无 | 无 | 无 | 中 |
| 搜索 | 服务端/本地组合 | Tantivy | PostgreSQL/服务端 | 需自建 | 需自建 | 需自建 | 数据库/插件 |
| 跨平台客户端 | Electron/Web | Flutter | Web | Web | Web | Web | Web |

## 5. 面向飞书文档类产品的推荐架构

### 5.1 领域模型

建议从第一天就把“文档内容”和“产品元数据”分开：

```text
Tenant
 └─ Workspace
     ├─ Member / Group / Role
     ├─ Space / Collection
     │   └─ Document
     │       ├─ BlockTree（正文：块树 + inline marks）
     │       ├─ Comment / Thread
     │       ├─ Revision / Snapshot
     │       ├─ Attachment / Embed
     │       └─ Permission / ShareLink
     └─ SearchIndex / Notification / AuditEvent
```

关键原则：

1. `Document` 保存标题、父级、排序、状态、所有者、权限等元数据。
2. `BlockTree` 保存规范化 JSON，不直接把 HTML 当作唯一真相。
3. 每个 Block 有稳定 ID、类型、属性和 children；inline 文本用 Mark/attributes 表达。
4. 评论、提及、任务、页面引用使用 Block ID + range 或结构化锚点，避免绑定 DOM 偏移量。
5. 版本保存 CRDT 更新或压缩后的快照，并为搜索、导出提供可重建的线性化文本。

### 5.2 编辑器层

推荐两条路线：

**路线 A：Tiptap + 自建块层**

- Tiptap/ProseMirror 负责 schema、transaction、history、selection 和渲染。
- 产品层实现 BlockNode、Slash 菜单、拖拽、页面嵌套、评论锚点和数据库块。
- 优点是可控性高、前端技术栈简单、长期可维护性好。
- 代价是需要自己补齐大量 UI 和块交互。

**路线 B：BlockNote 起步，再逐步下沉**

- 先用 BlockNote 获得块编辑体验、默认菜单、拖拽和 React 组件。
- 用自定义 BlockSchema 承载页面引用、数据库、任务、媒体、代码和嵌入。
- 当产品出现复杂评论、修订、导出或性能瓶颈时，再直接使用 Tiptap/ProseMirror 能力。

### 5.3 协作与一致性

推荐使用 CRDT + WebSocket：

```text
Editor transaction
      ↓
Y.Doc / Y.XmlFragment 或自定义共享类型
      ↓ WebSocket
Hocuspocus/自建协作服务
      ├─ Redis presence / room routing
      ├─ PostgreSQL metadata
      └─ Object storage：快照、附件、导出文件
```

必须提前定义：

- 文档房间的租户隔离和权限检查时机。
- 离线更新的保留周期、压缩和垃圾回收。
- 用户删除、撤回、历史回放和审计的语义。
- 同一文档多人编辑时，评论、任务状态和权限变更是否进入 CRDT。
- 大文档分片、懒加载、虚拟滚动和增量保存策略。

### 5.4 服务端与基础设施

建议的 MVP 服务拆分：

| 服务 | 职责 | 推荐技术 |
|---|---|---|
| API | 文档树、用户、权限、评论、分享链接 | NestJS/TypeScript 或 Koa |
| Collaboration | 房间、同步、presence、冲突合并 | Hocuspocus/Yjs/WebSocket |
| Metadata DB | 租户、用户、文档元数据、ACL、评论、版本索引 | PostgreSQL + Prisma/Drizzle |
| Cache/Queue | 缓存、异步导出、通知、索引任务 | Redis + BullMQ |
| Object Storage | 图片、附件、导出包、历史快照 | S3/兼容对象存储 |
| Search | 文档全文、标题、标签、权限过滤 | PostgreSQL FTS 起步，规模化后 OpenSearch |
| Worker | 导入导出、缩略图、AI 摘要、索引、病毒扫描 | Node worker 或独立任务服务 |

### 5.5 产品路线

**MVP**

- 文档树、标题/段落/标题层级/列表/引用/代码/图片。
- Block ID、拖拽排序、Slash 菜单、Markdown/HTML 导入导出。
- 单文档实时协作、光标/选区、基础评论。
- 工作区成员、文档级 ACL、分享链接、回收站。
- PostgreSQL 元数据、S3 附件、Redis 队列、基础全文检索。

**V1**

- 页面嵌套、双向链接、@提及、任务块、表格/数据库视图。
- 修订历史、版本对比、评论线程、通知、审计日志。
- 权限继承、群组、访客、组织级空间和模板。
- 导出 PDF/Word/Markdown，导入 Notion/飞书/Word。

**V2**

- 离线编辑和本地优先同步。
- 多人批注、文档锁定、受限编辑、内容审批。
- AI 摘要、问答、语义搜索、引用溯源和自动化工作流。
- 桌面端/Electron 或 Flutter 客户端。

## 6. 选型决策矩阵

| 你的优先级 | 首选 | 备选 | 原因 |
|---|---|---|---|
| 2–4 周内完成可用 Web 编辑器 | BlockNote | Tiptap | 默认 UI 和块交互节省大量产品开发时间 |
| 长期自研、强定制、设计系统优先 | Tiptap | CKEditor 5 | Headless + 扩展模型更容易控制产品体验 |
| 企业级评论/修订/导出 | CKEditor 5 | Tiptap + 自建 | CKEditor 的插件和模型/视图转换更成熟 |
| 本地优先、桌面端优先 | AFFiNE/BlockSuite | AppFlowy | 两者都有完整的本地数据与协作设计 |
| 研究修订历史、作者归属 | Etherpad | Outline | Etherpad 的时间轴和作者颜色表达直接 |
| 完整知识库后端参考 | Outline | AFFiNE | Outline 的 API、权限、队列和共享编辑器边界清晰 |

## 7. 风险与工程检查清单

- **许可证**：AFFiNE、Outline、AppFlowy、CKEditor 5、BlockNote 的许可边界不同；在商业发布前必须逐包建立 SBOM 和许可证清单。
- **数据模型锁定过早**：不要直接把某个编辑器内部 JSON 当公共 API；应加一层版本化的领域文档协议。
- **协作权限**：WebSocket 建连成功不代表有文档权限；房间加入、更新广播、历史读取都要做租户/文档级鉴权。
- **大文档性能**：虚拟化、按页/块懒加载、图片压缩、增量快照应在设计阶段纳入，而不是上线后再补。
- **导入导出一致性**：HTML、Markdown、Word 与内部 BlockTree 的往返转换必须有快照测试和丢失字段报告。
- **版本与删除语义**：CRDT 历史、用户可见版本、审计日志、回收站并不是同一件事，建议分别建模。
- **第三方依赖升级**：Tiptap、ProseMirror、Yjs、React 等升级可能影响 schema、序列化和协作协议，需锁定兼容矩阵。

## 8. 参考链接汇总

- [AFFiNE](https://github.com/toeverything/AFFiNE) · [README](https://github.com/toeverything/AFFiNE/blob/canary/README.md)
- [AppFlowy](https://github.com/AppFlowy-IO/AppFlowy) · [README](https://github.com/AppFlowy-IO/AppFlowy/blob/main/README.md)
- [Outline](https://github.com/outline/outline) · [Architecture](https://github.com/outline/outline/blob/main/docs/ARCHITECTURE.md)
- [Tiptap](https://github.com/ueberdosis/tiptap) · [README](https://github.com/ueberdosis/tiptap/blob/main/README.md)
- [BlockNote](https://github.com/TypeCellOS/BlockNote) · [README](https://github.com/TypeCellOS/BlockNote/blob/main/README.md)
- [CKEditor 5](https://github.com/ckeditor/ckeditor5) · [README](https://github.com/ckeditor/ckeditor5/blob/master/README.md)
- [Etherpad](https://github.com/ether/etherpad) · [README](https://github.com/ether/etherpad/blob/develop/README.md)
- [GitHub REST API：仓库元数据](https://docs.github.com/en/rest/repos/repos#get-a-repository)
