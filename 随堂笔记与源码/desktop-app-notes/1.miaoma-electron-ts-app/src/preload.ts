// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

// 直接渲染进程往主进程发消息
ipcRenderer.send("message", "hello from render process");


// 往 window 暴露一个 api 对象
contextBridge.exposeInMainWorld("miaoma", {
    sendMessage: (message: string) => {
        ipcRenderer.send("message", message);
    },
    onUpdateCounter(callback) {
      ipcRenderer.on("update-counter", (event, arg) => {
        callback(arg);
      });
    }
})