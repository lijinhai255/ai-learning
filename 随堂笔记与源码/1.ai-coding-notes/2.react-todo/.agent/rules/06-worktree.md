# Git Worktree 与多特性并行

## 分支和目录模型

每个独立特性使用一个分支和一个 worktree 目录，目录名称包含短任务号和主题，例如 `../2.react-todo-wt/feat-todo-filter`。主工作区用于集成和文档，特性 worktree 用于实现与验证。一个分支只绑定一个 worktree。

## 创建流程

开始并行任务前先确认基线、工作区状态和目标分支，然后创建 worktree。新 worktree 需独立安装依赖或复用已验证的 pnpm store，并记录运行端口、环境文件来源和测试数据策略。环境文件采用复制后的本地实例，不纳入版本控制。

示例命令如下，`BASE_BRANCH` 和 `FEATURE_ID` 必须替换为任务实际值：

```bash
git status --short
git worktree add -b "feat/FEATURE_ID" "../2.react-todo-wt/FEATURE_ID" "BASE_BRANCH"
cd "../2.react-todo-wt/FEATURE_ID"
pnpm install
pnpm verify
git worktree list
```

合并并确认没有未提交改动后，再由负责人执行清理：

```bash
git worktree remove "../2.react-todo-wt/FEATURE_ID"
git branch -d "feat/FEATURE_ID"
```

清理属于有影响的操作，必须先核对目标路径和 `git status`，并获得明确确认。

## 并行开发协议

- 每个 worktree 领取清晰边界，文件所有权和接口变更提前登记。
- 跨特性共享改动先通过契约或小型基础分支合并，避免多个 worktree 同时重写同一文件。
- 每个 worktree 在交付前运行受影响包的完整门禁，并提供变更摘要和冲突提示。
- 合并顺序优先选择基础设施、契约、服务端，再到前端和文档；顺序变化需记录原因。

## 收尾和清理

合并后保留可追溯分支记录，再清理已确认无未提交改动的 worktree。清理前检查 `git status`、未跟踪文件和运行中的进程，避免误删用户工作。需要保留的测试报告或截图复制到统一产物目录。

## 冲突处理

冲突先按需求、契约和测试判断目标行为，再逐段合并。共享配置、锁文件和生成文件冲突需由维护该边界的责任人处理，并重新运行全量门禁。
