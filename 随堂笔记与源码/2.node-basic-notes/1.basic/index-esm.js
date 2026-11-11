// console.log("hello");
// http
// const http = require("node:http");
import http from "node:http";
// const { sum } = require("./sum-commonjs.js");
import { sum } from "./sum-esm.js";
// import http from "node:http";

const app = http.createServer((req, res) => {
  // 路径映射表，Controller   MVC（Model View、Controller）
  res.end("hello world");
});

app.listen(3000);
