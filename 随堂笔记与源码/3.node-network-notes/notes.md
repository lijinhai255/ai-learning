# Node.js 网络层协议与服务开发

## http 模块详解

1. 创建 http 服务实例
2. 请求、响应封装

> python fastapi createApp


### 用途

http 可以做为创建服务方法
http 可以作为客户端，爬虫

### 使用

- createServer
- req 参数
    - req.headers  请求头
    - req.method   请求方法
    - req.url      请求路径
- res 参数
    - write       响应流写入内容
    - end         响应流关闭方法
    - setHeader   单个设置响应头
    - setHeaders  多个设置响应头
    - writeHeader 写入响应头

## express

Express 或者是 Fastify 这些呢都是作为 Nest JS 的底层服务层的引擎。
就是对于服务中间多个路径的内容访问和处理。/user   /detail   /blog   Controller

## websocket

http 协议单向，前端请求、服务端返回，服务端属于被动的
如果我们想服务端也主动：
- sse，server-side-events 服务端事件推送
- websocket，服务端主动流推送


ws、socket.io，为什么在前端用 WebSocket

## tcp

http 服务端，（浏览器充当了客户端）
tcp，服务端、客户端


## udp

udp，服务端、客户端