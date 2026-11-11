# AI 研发协作规范

## 适用范围

本文件是仓库级入口规则，适用于需求分析、设计、编码、测试、评审、交付和后续维护。`.agent/rules/` 目录保存可独立演进的细则，所有参与任务的智能体都需先阅读本文件，再按照任务类型加载对应规则。

新增特性优先使用 `docs/requirements/feature-template.md` 记录背景、范围、验收矩阵、测试计划和验收结果；架构取舍写入 `docs/adr/`。

## 项目上下文

目标工程采用 pnpm workspace 的 monorepo 组织方式，前端以 React 和 Vue 为主要技术栈，服务端采用 NestJS。每项功能从需求拆解开始，以自动化测试和可追溯的验收证据结束。

推荐的初始布局如下，实际目录以仓库现状为准。

```text
apps/
  web-react/       React 应用
  web-vue/         Vue 应用
  api-nest/        NestJS 服务
packages/
  ui/              跨应用设计系统与基础组件
  contracts/       API 契约、DTO 类型和校验 schema
  config/          ESLint、TypeScript、CSpell 等共享配置
  test-utils/      测试工厂、Mock、测试环境辅助函数
tests/
  e2e/             Playwright 集成测试
.agent/
  rules/           工程细则
  skills/          项目级 Skill 说明与脚本
  mcp/             MCP 服务和工具契约
```

## 规则加载顺序

按任务所需读取规则；发生冲突时，顺序从上到下优先级递减。

1. 用户当前请求和验收标准。
2. 本文件中的通用约束。
3. `.agent/rules/00-context.md` 中的仓库上下文与变更边界。
4. 与任务直接相关的专题规则。
5. 组件、模块或目录内更具体的 `AGENTS.md`。

专题规则索引如下。

| 文件                                     | 适用内容                                     |
| ---------------------------------------- | -------------------------------------------- |
| `.agent/rules/01-requirements-and-tests.md` | 需求拆解、测试先行、验收条件                 |
| `.agent/rules/02-architecture.md`           | pnpm monorepo、分层、依赖方向、API 契约      |
| `.agent/rules/03-frontend-react-vue.md`     | React、Vue、可访问性、状态和组件设计         |
| `.agent/rules/04-backend-nestjs.md`         | NestJS 模块、接口、错误、数据访问            |
| `.agent/rules/05-quality-tooling.md`        | TypeScript、ESLint、CSpell、格式化和 CI 门禁 |
| `.agent/rules/06-worktree.md`               | 多特性并行、Git worktree、合并和清理         |
| `.agent/rules/07-multi-agent.md`            | 多智能体角色、任务协议、冲突处理             |
| `.agent/rules/08-skill-mcp.md`              | Skill、MCP、知识沉淀和版本治理               |
| `.agent/rules/09-autonomous-acceptance.md`  | Vitest、Playwright、全流程自动验收           |

## 交付生命周期

任何行为变更都遵循以下顺序。短任务也需在任务记录中说明省略项及原因。

1. 读取上下文与相关规则，确认影响范围和非目标。
2. 将需求拆为可验证的用户场景、业务规则、数据契约和质量属性。
3. 先写测试用例和验收条件，再实现最小可行代码。
4. 采用小步提交式变更进行实现；每一步保持类型检查和测试可运行。
5. 运行格式化、Lint、拼写、类型、单元、集成和构建检查。
6. 对照验收矩阵复核证据，记录命令、结果、已知风险和后续事项。
7. 更新相关规则、Skill 或 MCP 契约，使重复出现的做法得到沉淀。

## 通用工程约束

- 设计保持单一职责、清晰依赖方向和最小公开接口。优先简单实现，避免未被需求驱动的抽象。
- 新增代码默认使用 TypeScript，公共类型放入 `packages/contracts` 或对应共享包，避免应用之间复制类型。
- UI 组件遵循语义化 HTML、键盘可用、可见焦点和基本屏幕阅读器支持。
- API 先定义请求、响应、错误码和鉴权边界，再编写控制器和服务。
- 所有外部输入都经过 schema 或 DTO 校验；日志脱敏，密钥只从环境变量或密钥管理系统读取。
- 测试名称描述用户可观察行为；时间、随机数、网络和数据库均采用可控替身。
- 文档、代码注释和测试描述统一使用简体中文；领域专有名词保留官方英文拼写。
- 命令中的路径使用双引号；搜索优先 `rg`，当前环境缺少 `rg` 时采用等效工具。
- 未经明确请求，不执行提交、推送、重置、发布或删除等高影响操作。

## 任务回报格式

完成任务时，用简体中文报告以下内容。

- 结果摘要和用户可见行为。
- 变更文件及每个文件的职责。
- 已执行的验证命令和结果。
- 未执行项目、已知风险与建议的后续动作。
