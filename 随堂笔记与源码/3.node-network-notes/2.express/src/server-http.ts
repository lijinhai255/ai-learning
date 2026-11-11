// 导入模块
// 作为服务器
import http from "node:http";
// import { promisify } from "node:util";
// const createServer = promisify(http.createServer);

type Req = http.IncomingMessage;
type Res = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};
type ControllerHandler = (req: Req, res: Res) => void;

// 1. 在后端我们要自己实现一个路由映射，路由处理逻辑就称之为 Controller
const controllers: Record<string, ControllerHandler> = {
  "/": (req: Req, res: Res) => {
    const data = services["/"]({ name: "miaoma" });
    res.end(data);
    // return "首页";
  },
  "/user": (req: Req, res: Res) => {
    const data = services["/user"]({ age: 18 });
    res.end(data);
    // return "用户";
  },
  "/md": (req: Req, res: Res) => {
    const data = services["/md"]();
    res.end(data);
    // return "用户";
  },
};

// 2. 核心逻辑应该在 Service 中实现，比如数据库操作、文件IO
const services: Record<string, any> = {
  "/": (params: { name: string }) => {
    // 做一些业务逻辑
    // 读取数据库
    // 文件 io 的操作，可以看看上节课
    return "首页" + params.name;
  },
  "/user": (params: { age: number }) => {
    return "用户" + params.age;
  },
  "/md": () => {
    // 读取 md 文档
    // 返回 md 文档的内容
    // 时时刻刻一定要注意路径处理问题
    // 时时刻刻都要尽量使用绝对路径
    // path.join【返回相对路径】 和 path.resolve【返回绝对路径】 的区别？
    // const mdPath = path.resolve(__dirname, "../static/miaoma.md");
    // const data = fs.readFileSync(mdPath, "utf-8");

    return "## 123, hello";
  },
};

const app = http.createServer((req, res) => {
  console.log("req.headers", req.headers);
  console.log("req.method", req.method);

  const url = req.url;

  res.setHeader("Content-Type", "text/html;charset=utf-8")

  if (!url) {
    res.end("404");
    return;
  }
  // 策略模式解决多 Controller
  controllers[url]?.(req, res);
  // console.log("req.url", req.url);

  // console.log("hello");

  // res.setHeader("token", "xxx");
  // const headers = new Headers({ "Content-Type": "text/html" });
  // res.setHeaders(headers);
  // res.writeHead(200, { "Content-Type": "text/plain" });

  // res.write("hello");
  // res.write("world");

  // res.end("hello"); // 关闭响应流
});

app.listen(3000);
