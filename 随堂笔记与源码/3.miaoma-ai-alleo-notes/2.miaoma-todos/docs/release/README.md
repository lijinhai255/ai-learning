# 发布清单

## Web

- `apps/web/dist`
- 静态资源压缩包
- 版本号与构建提交号

## Desktop

- macOS `.dmg`
- Windows `.exe` 或安装包
- Linux `.AppImage`
- 更新元数据与校验和

## Mobile

- Android `.aab`
- iOS `.ipa` 或 Xcode Archive
- 隐私清单、版本说明和截图

## Server

- NestJS Docker 镜像
- Spring Boot Docker 镜像
- FastAPI Docker 镜像
- Compose 文件
- 数据库迁移文件
- `.env.example`
- 回滚版本号

生产 Compose 的变量模板位于 `Docker/.env.prod.example`。部署前必须复制到服务器的受控目录，并替换所有示例密钥。

生产部署需要单独注入 DockerHub Token、SSH 私钥、数据库密码、Redis 密码、JWT Secret、域名和支付密钥。

构建和部署模板：

```bash
DOCKERHUB_NAMESPACE=your-namespace RELEASE_TAG=0.1.0 ./Docker/publish.sh
ALIYUN_SSH_HOST=TARGET ALIYUN_SSH_USER=DEPLOY_USER ALIYUN_SSH_KEY=/path/to/key RELEASE_TAG=0.1.0 ./Docker/deploy-aliyun.sh
```

脚本只负责镜像推送、远端拉取和 Compose 重启，生产服务器上的密钥仍需通过受控环境注入。
