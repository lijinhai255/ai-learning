// 1. 服务端通过 react 渲染内容
import http from "node:http";
// 2. 返回渲染的 html 字符串
import React, { useState, createElement } from "react";
import { renderToString, renderToPipeableStream } from "react-dom/server";
// 3. 客户端接管，react hydrate

const App = () => {
  const [count, setCount] = useState(0);

  setInterval(() => {
    setCount((count) => count + 1);
  }, 1000);

  return createElement(
    "h1",
    null,
    createElement("span", null, "Count: "),
    createElement("span", null, count)
  );
};

const server = http.createServer((req, res) => {
  const appHtml = renderToPipeableStream(createElement(App));
  appHtml.pipe(res);
  //   console.log("🚀 ~ server ~ appHtml:", appHtml);
  //   const html = `
  //     <!doctype html>
  //     <html lang="en">
  //     <head>
  //         <meta charset="UTF-8" />
  //         <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //         <title>Vite + React + TS</title>
  //     </head>
  //     <body>
  //       <div id="root">${appHtml}</div>
  //     </body>
  //     </html>

  //   `;
  //   res.end(html);
});

server.listen(3000, () => {
  console.log("server is running at localhost:3000");
});
