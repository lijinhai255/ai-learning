/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import "./index.css";

console.log(
  '👋 This message is being logged by "renderer.ts", included via Vite'
);

/**
 * 渲染进程到主进程的通信，方式一：使用 ipcRenderer.send，定义在 preload.ts 中
 */
// let count = 0;
// setInterval(() => {
//     window.electronAPI.setTitle(`Hello from Vite! ${count++}`);
// }, 1000);

/**
 * 方式二：使用 ipcRenderer.invoke，定义在 preload.ts 中
 */
// const downloadBtn = document.getElementById("download");
// downloadBtn?.addEventListener("click", async () => {
//   await window.electronAPIMiaoama.fileOpen();
// });

/**
 * 主进程到渲染进程的通信，主进程通过 mainWindow.webContents.send，渲染进程通过 ipcRenderer.on 接收
 */
let val = 0;
window.electronAPI.onUpdateCounter((value) => {
    val += value;
  console.log("🚀 ~ file: renderer.ts ~ line 88 ~ value", val);
});
