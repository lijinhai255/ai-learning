# Nest 核心概念详解

## Nest 项目架构与搭建

pnpm add -g @nestjs/cli
版本：12.0.8，nodejs 版本最好 24.21.0

控制反转 IOC（全称：Inverse of Control，控制反转） 、依赖注入 AOP（全称：Aspect Oriented Programming，面向切面编程）

## Nest 核心概念详解

1. controller
2. provider
3. module
4. middleware
5. filter
6. pipe
7. guard
8. interceptor

![alt text](image.png)

### controller

控制器，负责处理 HTTP 请求，调用服务层的逻辑，返回响应。

- 定义请求方法
    - Get
    - Post
    - Put
    - Delete
    - Patch
- 接受请求参数
    - body
    - query
    - param
- 返回
