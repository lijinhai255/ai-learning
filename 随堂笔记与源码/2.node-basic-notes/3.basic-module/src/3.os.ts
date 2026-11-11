// os 模块，查看系统信息
import os from "node:os";

// - os.arch()：返回操作系统的架构（如 x64）
// - os.platform()：返回操作系统的平台（如 win32、linux、darwin）
// - os.cpus()：返回系统的 CPU 信息
// - os.freemem()：返回可用的系统内存
// - os.totalmem()：返回系统的总内存
// - os.homedir()：返回当前用户的主目录
// - os.uptime()：返回系统运行时间（秒）
console.log("os.arch", os.arch())
console.log("os.platform", os.platform())
console.log("os.cpus", os.cpus().length, os.cpus())
console.log("os.freemem", os.freemem()/1024/1024)
console.log("os.totalmem", os.totalmem()/1024/1024)
console.log("os.homedir", os.homedir())
console.log("os.uptime", os.uptime())