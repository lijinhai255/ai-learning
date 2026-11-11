import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

// json 解析
app.use(bodyParser.json());
// 表单 urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// 跨域问题
app.use(cors());

// 日志中间件
app.use((req, res, next) => {
  // 给所有响应加上一个共同的响应头
  console.info(
    `[INFO][${new Date().toLocaleString()}] ${req.method} ${req.url}]`,
  );
  next();
  console.info(
    `[INFO][${new Date().toLocaleString()}] ${req.method} ${req.url}]`,
  );
});
// 中间件
app.use((req, res, next) => {
  // 给所有响应加上一个共同的响应头
  res.setHeader("Content-Type", "text/html;charset=utf-8");
  next();
});

app.get("/", (req, res) => {
  res.end("首页");
});
app.post("/", (req, res) => {
  res.end("首页");
});
app.get("/user", (req, res) => {
  res.end("用户");
});
app.get("/login", (req, res) => {
  res.end("登录");
});
app.get("/md", (req, res) => {
  res.end("md");
});

app.listen(3000, () => {
  console.log("启动成功，监听在 localhost:3000");
});
