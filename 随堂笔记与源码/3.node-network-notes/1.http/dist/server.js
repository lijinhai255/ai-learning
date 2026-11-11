// 导入模块
// 作为服务器
import http from "node:http";
// import { promisify } from "node:util";
// const createServer = promisify(http.createServer);
const app = http.createServer((req, res) => {
    console.log("req.headers", req.headers);
    console.log("req.method", req.method);
    console.log("req.url", req.url);
    console.log("hello");
    res.setHeader("token", "xxx");
    const headers = new Headers({ 'Content-Type': 'text/html' });
    res.setHeaders(headers);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("hello");
    res.write("world");
    res.end("hello"); // 关闭响应流
});
app.listen(3000);
//# sourceMappingURL=server.js.map