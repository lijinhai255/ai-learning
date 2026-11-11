// web，浏览器很弱文件操作能力，文件 input
// 文件增删改查
import fs from "node:fs";
import fspromise from "node:fs/promises";
import { promisify } from "node:util";
// 文件路径
// 要用绝对路径：1. commonjs：__dirname【esm 规范：import.meta.dirname】，2. path 模块拼接

// 1. 文件路径
// 2. 读取文件内容
// 3. 异步  readFile、readFileSync
// console.log(import.meta.dirname + "../package.json")
const pkgPath =
  "/Users/heyi/Downloads/node-basic-notes/3.basic-module/package.json";
fs.readFile(pkgPath, "utf-8", (err, data) => {
  console.log("🚀 ~ err:", err);
  console.log("🚀 ~ data:", data);
});
// fs.readFile('../notes.md', "utf-8", (err, data) => {
//     console.log('🚀 ~ err:', err)
//     console.log('🚀 ~ data:', data)

// })
fs.writeFile(
  "/Users/heyi/Downloads/node-basic-notes/3.basic-module/dist/test.txt",
  "hello",
  () => {
    console.log(111);
  },
);
fs.writeFile(
  "/Users/heyi/Downloads/node-basic-notes/3.basic-module/dist/test2.txt",
  "hello",
  () => {
    console.log(111);
    fs.unlink(
      "/Users/heyi/Downloads/node-basic-notes/3.basic-module/dist/test2.txt",
      () => {},
    );
  },
);

fs.stat(
  "/Users/heyi/Downloads/node-basic-notes/3.basic-module/dist/test2.txt",
  (err, stats) => {
    console.log(stats);
  },
);

//   fspromise.stat("/Users/heyi/Downloads/node-basic-notes/3.basic-module/dist/test2.txt").then()

const fsp = promisify(fs.readFile)