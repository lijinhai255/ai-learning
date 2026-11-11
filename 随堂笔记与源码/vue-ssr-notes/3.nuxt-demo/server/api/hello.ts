// 定义事件返回 api 数据
// 这是属于服务端代码
import fs from "node:fs";
import path from "node:path";

// 连接数据库

export default defineEventHandler((event) => {
  console.log(
    "🚀 ~ defineEventHandler ~ import.meta.dirname:",
    import.meta.dirname
  );
  // 当前 path
  const currentPath = path.resolve("server/api/test.txt");
  console.log("🚀 ~ defineEventHandler ~ currentPath:", currentPath);
  const content = fs.readFileSync(currentPath, "utf-8");
  console.log("🚀 ~ defineEventHandler ~ content:", content);
  return {
    hello: "world" + content,
  };
});
