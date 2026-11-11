# 基于 AI 全语言产品生态架构学习进阶

## 【CEO】Codex 辅助商业研判与模式调研

**沉淀商业研判与市场调研 Skill**

- codex
    - browser use skill/plugin（agent browser） 浏览器自动化
        - 可视化搜索
        - 爬虫场景
        - 自动化场景
    - computer use skill/plugin 电脑应用自动化
        - 用来控制电脑应用，控制 trae 来写一段代码，控制剪映剪辑一段视频，gpt6 astra 控制 blender 完成 3D 建模


我要做一个面向在职开发者的 AI 全栈培训产品，客单价 9800 元。
请帮我验证：
1. 目标市场规模有多大？
2. 主要竞品有哪些？他们的定价和课程设置如何？
3. 用户付费意愿如何？9800 元的定价是否合理？

我要做一个面向C端用户的健康饮食的 App，基于 iOS 订阅模式
请帮我验证：
1. 目标市场规模有多大？
2. 主要竞品有哪些？他们的定价和课程设置如何？
3. 用户付费意愿如何？
4. MVP 功能

whisper flow、豆包输入法 ✅

## 【CPO】Codex 辅助用户与需求分析

- 用户研究 → 需求分析 → PRD 撰写 → 原型设计，全流程 AI 辅助
- 用户研究四场景：评论语义聚类、用户画像生成、用户旅程图、虚拟用户访谈
- 需求优先级：RICE 评分模型，Codex 提供客观估算，人工做最终决策
- PRD 自动生成：Spec 驱动，可自动化验收标准是核心
- **Skill 沉淀：PRD 生成 Skill，统一团队文档规范**

**提示词模板：**
基于以下需求描述，生成完整的 PRD 文档：

需求：[需求描述]
目标用户：[用户群体]
成功指标：[可量化指标]

要求：
1. 每条功能需求必须包含"可自动化验收标准"（Given/When/Then 格式）
2. 包含异常流程处理
3. 明确标注"不在本期范围内"的功能
4. 输出为标准 PRD 格式


## 【CTO】Codex 辅助全语言技术生态学习进阶

方案设计、工程化设计、架构设计、基于自动化测试用例编写代码

前端
- 端：Web端【react、vue】、H5端、小程序【原生、Taro】、桌面端【Swift、C#/QT、**Electron/Tauri2**】、手机端【Swift、Kotlin/Compose、**React-Native/Flutter**】
- 打包：Vite

服务端
- nodejs、nestjs，jwt
- python **fastapi**、Django、flask
- java spring boot 技术栈，Spring Security.
- 基建层
    - 数据库业务数据库，我们直接Postgres SQL。缓存型数据库Redis。向量型数据库，我们可以用PGVector或者是Milvus或者是Qdrant都可以。大数据量的日志型数据库，可以选择，比如像ClickHouse。
    - 消息队列的话，可以基于Kafka、RabbitMQ等等。
    - 健全体系的话，根据不同的语言，比如说Java的话，那就是


AI层
- nodejs
    - langchainjs
    - langgraphjs 复杂的图编排和复杂流程的AI操作、AI执行。
    - deepagentsjs 能够让你去做更通用化的一些智能体，因为它里面涉及到沙箱机制、权限，所有的会比前两个框架要更全面。
- python
    - langchain
    - langgraph
    - deepagents
- java
    - Langchain4J


## QA

自动化测试用例编写、基于 Playwright/browseruse 自动化测试

## devops

自动运维


## 串联提示词概要口水话

研判
设计整个todo list的基础功能，可以去调研一下目前市面上已有的一些todo list，比如特别是Things 3，还有国内的像滴答清单这些。帮我梳理一个完整功能以及付费规则。

产品调研
帮我具体分析产品需求、用户群体所有，然后呢，规划出来产品文档以及PRD。这个PRD呢，你要注意啊，PRD要设计几个端，一个是桌面端、网页端，还有手机端。当然了，桌面端跟Web端、网页端其实属于同一端，就是同一套设计，其实要做两套设计图。一套这个PRD呢，是设计大屏的像桌面的，像Web端的。然后呢，小屏，就比如像手机、Pad。

---

设计接入
同学们一定不要截图直接甩给Codex。一定所有的设计都要落到设计图上面。
后边不管是用Figma、MCP，还是我们说的这个pencil这些去把它接入进去之后呢，达到视觉稿百分百还原的这个目的。

---

技术
整体采用monorepo架构，啊，pnpm monorepo 架构。然后呢，我有三个端都需要去实现，哪三个端呢？不，当然这个界面端的话是分为两个端，服务端的话是分为三个语言体系，啊，这里分别说明一下。
前端主框架使用React Vite作为基础架构，来实现Web端和H5端。基于React Native来开发iOS安卓端跨端应用。基于Electron Forge开发桌面端桌面端体系APP。
服务端层分为三个语言体系，基于Nest JS的基于Spring Boot的。基于Fast API的。
再然后就是基建层统一使用Docker，在当前项目下啊，直接建立一个Docker文件夹，分为Docker的服务编排和Docker的构建。Docker服务编排基于Docker Compose，Docker服务编排基于Docker File。基础基建呢，包含业务数据库PostgreSQL、缓存Redis。都使用官方镜像，使用最新镜像。

QA
按照上述的功能需求、产品的需求，帮我详细去拆解自动化单元测试用例，衔接以上，后续会基于ViTest来做测试。同时还需要有集成测试。集成测试方案选择Playwright。

devops
帮我去做所有前端层、服务端层以及完整部署上线的打包构建工作。构建好之后把产物集中起来，给我列举一个发布清单。
属于服务端层的话，那你就直接基于我给到你的阿里云服务器的账号密码，来去自动帮我把构建的内容。如果说是Docker构建的话，帮我发布到DockerHub上面，然后再在阿里云上，通过SSH到阿里云，去基于DockerHub拉取最新镜像来完成部署。如果是端的，比如说iOS、安卓这些应用的话，帮我提供对应的这个发布的产物，就是构建的产物啊。然后呢，我自行去到分发平台上。