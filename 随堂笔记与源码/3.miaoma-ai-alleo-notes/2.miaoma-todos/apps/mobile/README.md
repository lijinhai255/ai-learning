# @miaoma/mobile

基于 React Native 的 iOS/Android 跨端骨架。当前提供最小 Today 页面，后续接入导航、离线存储、推送、深链接和共享 API Client。

```bash
pnpm --filter @miaoma/mobile start
pnpm --filter @miaoma/mobile ios
pnpm --filter @miaoma/mobile android
pnpm --filter @miaoma/mobile typecheck
```

原生工程（`ios/`、`android/`）建议在确定 React Native 版本和 CocoaPods/Gradle 约束后，通过 React Native CLI 初始化，以避免手写平台文件产生漂移。
