# TypeScript 全栈类型安全与 Monorepo 工程架构实战

## TypeScript 工程基础与进阶

**TypeScript** 出现呢，是因为 JavaScript 属于一个弱类型的语言，它没有一个强类型的语言体系约束。
1. 目前市面上，特别是大家关注国外的一些产品，像OpenClaw、Hermes、LLM Wiki。都是基于TypeScript开发的智能体。
2. AI来去写代码的话，一定要有很强的规则约束。那TypeScript语言体系包括工程体系，其实就很好的能够让AI在这个基础上去完成你的代码开发。

### 环境搭建

1. 编译，ts 需要编译成 js 语言 + dts 类型声明文件
    - tsc，官方编译器
    - babel、webpack、vite
    - tsup，esbuild（Go 语言）
    - tsdown，rust 语言新兴工具

### 基于 tsc 的构建
1. 初始化，npm init
2. typescript，@types/node
3. 安装依赖，配置文件 npx tsc --init
4. 定义编译脚本命令，tsc
5. 构建，pnpm build

### 基于 tsdown 的构建
1. 初始化，npm init
2. typescript，@types/node，tsdown
3. 安装依赖，配置文件 npx tsc --init
4. 定义编译脚本命令，tsdown
5. 配置 tsdown 的编译配置
6. 构建，pnpm build



进阶 python 基础快速学习
- npm - uv、conda
- pacakge.json - requirements.txt




ts agent 框架，往 Python 体系拓展