// 服务器端渲染的入口
// 1. http 模块
// commonjs
// const http = require('http')
// esm
import http from "node:http";
// 读取文件，fs 模块，fs-extra
import fs from "node:fs";
// 路径问题
import path from "node:path";

const app = http.createServer((req, res) => {
  // 读取 html 代码
  const html = fs.readFileSync(
    path.resolve(import.meta.dirname, "./index.html"),
    "utf-8"
  );
  // 交给 Vue 和 Vite 来做
  const compiledHtml = html.replace("{{ name }}", "合一");
  res.end(compiledHtml);
});

app.listen(3000, () => {
  console.log("server is running at localhost:3000");
});
