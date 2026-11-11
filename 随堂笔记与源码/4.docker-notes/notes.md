# Docker 基础与进阶指南

## Docker、Docker Desktop 安装与环境初始化

### 为什么要 Docker

1. Docker是为了解决系统部署环境一致性问题的。
2. AI-Native，效率和自动化，AI 编写代码、文本，yaml、json【CI/CD 标准化】

## Docker 核心概念

### 镜像 Image

- 光盘
    - nodejs 环境：1. 找 nodejs 镜像 -> 拉到本地 -> 
    - caddy 环境（nginx）：1. 找 caddy 镜像  -> 拉到本地 -> 启动

### 容器 Container

将镜像运营之后，运行时状态产物
一个镜像可以运行出来十个百个千个容器

### 卷宗 Volume

卷宗就像是硬盘存储容器运行时产生的一些数据
postgres 数据库，定期备份同步【Volume 本地宿主环境 -> 定期脚本备份数据上传 oss】


## Docker 常用命令

- 镜像
    - 拉取                 docker pull caddy:2
    - 查看本地              docker images
    - 分层                 docker history caddy:2
    - 删除                 docker rmi caddy:2
    - 构建                 docker build -t heyi .
    - 本地镜像打标签         docker tag heyi:1.0
    - 镜像压缩打包          docker save heyi -o heyi.tar
    - 从压缩包加载镜像       docker load -i heyi.tar
- 容器
    - 启动容器              docker run  --name -p -v（name：启动容器名称，p端口映射，v卷宗挂载）
    - 查看运行中的容器       docker ps
    - 查看所有容器           docker ps -a
    - 停止容器              docker stop
    - 启动已停止的容器        docker start [容器名、容器 id]
    - 重启容器              docker restart [容器名、容器 id]
    - 删除容器              docker rm [容器名、容器 id]
    - 在容器中执行xxx命令    docker exec -it [容器id] sh
    - 查看容器日志          docker logs [容器名、容器 id]
    - 查看容器资源占用       docker stats
    - 查看容器配置          docker inspect [容器名、容器 id]
    - 将容器中的文件复制到宿主主机（你的电脑、服务器主机）中   docker cp 
- 网络【为了不同的容器之间通信】
    - 创建
    - 查看
- 卷宗


