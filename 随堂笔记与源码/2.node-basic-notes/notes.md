# Node.js Runtime 基础与常用模块精析

## Node 介绍与安装

Node.js 基于 Google 的 V8 JavaScript 引擎，可以使用在，比如说用来去开发服务端，可以开发命令行工具等等。

- Web 服务器
- RESTful API
- 实时聊天应用（如 WebSockets）
- 微服务架构
- 命令行工具
- Agent 产品内核

AI-Native 时代学习 nodejs 体系的目的：第一步呢，就是先基于Nodejs和TypeScript，把完整全站全链路的实现生态掌握。掌握以后，目的是能够掌握后续去编排基于Vibe Coding或者AI开发Java、 Python、 Golang生态体系的提示词。当你掌握了基于Java、 Python或者Golang的生态体系的全站的产品业务开发相关经验以后，你再回头来去细化，去看Python、 Java、 Golang对应生态体系的一些细节。

- nodejs，nvm、volta、n、fnm 管理多版本 ✅
- python，uv、conda
- java，maven

### nvm 为例

- 安装
    - mac：curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    - windows：https://www.nvmnode.com/guide/download.html
- nvm -h
- nvm install 24.21.0
- nvm use 24.21.0
- nvm alias default 22.23.1   设置为默认版本
- nvm uninstall 24.21.0
- nvm reinstall-packages 22.23.1     把老版本Node里面的依赖装过来。


### nodejs 工程

1. 工程说明文件
    - nodejs，package.json
    - java，mvn
    - python，projects.toml
2. 初始化
    - npm init
3. hello world
4. 执行 node index.js


### nodejs 服务

## 模块化与 package.json 详解

工程文件管理方式、package.json 工程说明

模块化
- commonjs
- esm

拓展：
- amd
- cmd

包的兼容性问题，就有些第三方包，它可能模块化是CommonJS的，或者是ESM的。等它导到你项目里面来的时候，它就会说这个模块化不支持


#### package.json

dependencies：生产环境的依赖。react
devDependencies：开发环境依赖。vite、webpack、babel
peerDependencies： UI 组件库
scripts：脚本，AI 辅助，只要能够把你工程做的一些工作流固定下来变成脚本的，都一定要固定下
main：CommonJS的规范下，它的入口文件。
module：ESM的规范下的入口文件。
bin：二进制入口文件。
types：类型入口文件。

## Typescript 支持

从 22.18.0 开始，node 支持直接执行 typescript 文件
但是建议尽量还是走编译逻辑，统一编译是最靠谱的，可能还会用 deno、bun 执行

## 核心模块详解

### 核心模块盘点

1. fs   文件系统
2. path 路径操作
3. os   系统
4. process 进程
5. child_process 子进程
6. util 工具

- buffer、stream

http、net


### fs

- readFile
- writeFile
- unlink
- exists 现在建议的是用  stat 替代

fs 有两个问题
1. 异步 promise 方式，util、fs/promise
2. 操作不灵活，fs-extra 库


#### path

- resolve
- join
- extname

#### os

- os.arch()：返回操作系统的架构（如 x64）
- os.platform()：返回操作系统的平台（如 win32、linux、darwin）
- os.cpus()：返回系统的 CPU 信息
- os.freemem()：返回可用的系统内存
- os.totalmem()：返回系统的总内存
- os.homedir()：返回当前用户的主目录
- os.uptime()：返回系统运行时间（秒）

#### process

- process.argv：获取命令行参数
- process.env：访问环境变量
- process.exit()：退出当前进程
- process.cwd()：获取当前工作目录
- process.memoryUsage()：获取进程的内存使用情况
- process.nextTick()：将回调放入下一次事件循环中执行

#### child_process

- spawn()：启动一个新进程并与其进行流式通信。 ✅
- exec()：执行外部命令，返回标准输出。
- fork()：专门用于创建 Node.js 子进程，并进行进程间通信。

spawn 用途
1. 程序中调用系统命令完成工作处理，ffmpeg、codex
2. 多进程实现多 Agent
3. python agent 在 nodejs 服务中调用

更面向于面试的表述：
- 并行执行任务：当有多个任务需要并行处理时，可以使用 spawn() 或 fork() 来创建多个子进程，从而提高应用的并发能力。
- 执行外部命令或脚本：使用 exec() 来执行外部的 shell 命令、调用外部工具等。
- 分离任务：如果一个任务可能导致崩溃或阻塞主进程，可以将其放入子进程中运行，以确保主进程的健壮性。