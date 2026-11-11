// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";

/**
 * 第一种方式
 */
// contextBridge.exposeInMainWorld("electronAPI", {
//   setTitle: (title) => {
//     console.log("🚀 ~ title:", title);
//     ipcRenderer.send("set-title", title);
//   },
// });

/**
 * 第二种方式
 */
contextBridge.exposeInMainWorld("electronAPI", {
  fileOpen: async () => {
    return await ipcRenderer.invoke("file-open");
  },
  /**
   * 暴露操作主进程的方法
   */
  onUpdateCounter: (callback) =>
    ipcRenderer.on("update-counter", (_event, value) => callback(value)),
});
