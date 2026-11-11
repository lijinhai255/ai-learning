import fs from "node:fs";
import path from "node:path";

const pkgPath = path.join(import.meta.dirname, "../package.json");

console.log("import.meta.dirname", import.meta.dirname)
console.log("import.meta.filename", import.meta.filename)   
console.log("import.meta.main", import.meta.main)
console.log("import.meta.url", import.meta.url)
fs.readFile(pkgPath, "utf-8", (err, data) => {
  console.log("🚀 ~ err:", err);
  console.log("🚀 ~ data:", data);
});



// - path.join()：将多个路径拼接成一个路径
// - path.resolve()：将相对路径解析为绝对路径
// - path.basename()：返回路径的最后一部分（文件名）
// - path.dirname()：返回路径的目录部分
// - path.extname()：返回文件的扩展名

const filePath = path.join(import.meta.dirname, "../package.json");
console.log('🚀 ~ filePath:', filePath)
const filePath2 = path.join(import.meta.dirname, "../package.json");
console.log('🚀 ~ filePath2:', filePath2)

console.log(path.basename(filePath))
console.log(path.dirname(filePath))
console.log(path.extname(filePath))