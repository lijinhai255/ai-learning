// 客户端渲染，react 入口的写法
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//     <App />
// )

import React from "react";
import { hydrateRoot } from "react-dom/client";

// 使用路由，浏览器历史记录栈路由
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

console.log("entry-client");

hydrateRoot(
  document.getElementById("root"),
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
