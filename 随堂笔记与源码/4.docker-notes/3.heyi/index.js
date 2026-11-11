const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Hello, heyi!\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});


// docker run heyi

// 1. nodejs 服务打包成镜像  Dockerfile
// 2. 打标签
// 3. 发布到 Docker hub，自己的 Docker 镜像仓库
// 4. 拉取镜像
// 5. 配置启动镜像