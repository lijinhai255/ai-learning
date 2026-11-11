import http from "node:http";
const server = http.createServer((req, res) => {
  const { url } = req;
  console.log("🚀 ~ server ~ url:", url);
  if (url === "/") {
    req.on("data", (chunk) => {
      console.log("🚀 ~ server ~ chunk:", chunk);
    });
    // 1. 流式传输
    // 2. 大文件上传
    // 3. 断点续传
  }

  res.end("hello world");
});

server.listen(8000);
