import "dotenv/config"

// 进程，开辟新的进程
// nodejs 调用 python 的代码
// nodejs 调用 linux 命令
// nodejs 智能体调用那个 mcp stdio 服务
console.log(process.argv)
const args = process.argv.slice(1)
console.log('🚀 ~ args:', args)

console.log(process.env) // 拓展生产级环境变量管理方式

// mcp，http、stdio

console.log("process.cwd()",process.cwd())
console.log("process.memoryUsage()",process.memoryUsage())