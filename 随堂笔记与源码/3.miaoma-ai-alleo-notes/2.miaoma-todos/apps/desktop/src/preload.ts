import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('miaomaDesktop', {
  platform: process.platform,
  version: process.versions.electron,
});
