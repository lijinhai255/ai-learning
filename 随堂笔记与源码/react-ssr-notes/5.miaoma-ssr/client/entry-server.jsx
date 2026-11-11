// 主要负责渲染工作
import React from "react";
import { renderToString } from "react-dom/server";

import { ServerStyleSheet } from "styled-components";

// react-router-dom 路由，说过在服务端，我们需要使用静态路由
// 1. BrowserRouter 浏览器路由
// 2. MemoryRouter 内存路由
// 3. HashRouter 哈希路由
// 4. StaticRouter 静态路由
import { StaticRouter } from "react-router-dom/server";

import App from "./App.jsx";

// 渲染函数
export function render(url) {
  // 样式提取器
  const sheet = new ServerStyleSheet();
  const appHtml = renderToString(
    sheet.collectStyles(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    )
  );

  //   获取到提取的样式
  const styleTags = sheet.getStyleTags();
  console.log("🚀 ~ render ~ styleTags:", styleTags);

  return {
    appHtml,
    styleTags,
  };
}
