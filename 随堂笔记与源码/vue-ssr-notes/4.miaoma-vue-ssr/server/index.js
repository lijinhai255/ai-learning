// 服务端渲染的服务入口
const express = require("express");
// 文件读取模块
const fs = require("node:fs"); // 如果是企业级开发，会选择 fs-extra
const path = require("node:path");

// vite 的服务端渲染的编译工作，启动一个 vite 服务
const { createServer } = require("vite");

// 创建服务
async function createViteServer(
  isProd = process.env.NODE_ENV === "production"
) {
  // 使用 express 创建基础服务应用
  const app = express();

  let vite;

  // 判断环境，开发环境和生产环境
  if (!isProd) {
    vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    // 生产环境，直接打包构建即可
    app.use(express.static(path.resolve(__dirname, "../dist")));
  }

  // 匹配路由，Controller
  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    // 同样要区分是开发环境还是生产环境
    // 开发环境
    let template, render;
    template = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf-8"
    );
    // 模板处理
    template = await vite.transformIndexHtml(url, template);
    // 渲染器处理
    render = (await vite.ssrLoadModule("/src/entry-server.js")).render;
    // 代码的提取、切片都在这里处理

    // 这时候通过渲染器，渲染结果
    const [appHtml] = await render(url);
    res.end(appHtml);
  });

  // 启动服务
  app.listen(3000, () => {
    console.log("ssr server running，http://localhost:3000");
  });
}

// 调用函数，启动服务
createViteServer();
