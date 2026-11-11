// 服务端入口
const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const { createServer: createViteServer } = require("vite");

async function createServer() {
  // 创建服务端应用
  const app = express();

  //   创建 Vite 服务
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
    appType: "custom",
  });

  //   console.log(vite.middlewares);
  //   中间件
  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    const url = req.originalUrl;
    // 详细处理 html 文件
    let template = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf-8"
    );
    // 详细处理 react 相关组件、包括服务端入口文件
    const { render } = await vite.ssrLoadModule(
      path.resolve(__dirname, "../client/entry-server.jsx")
    );

    // render(url)  ---> html、css
    const { appHtml, styleTags } = await render(url);

    const html = template.replace(`<!--app-html-->`, appHtml).replace(
        `<!--app-css-->`,
        styleTags
    );

    console.log("🚀 ~ app.use ~ html:", html);
    res.send(html);
  });

  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}

createServer();
