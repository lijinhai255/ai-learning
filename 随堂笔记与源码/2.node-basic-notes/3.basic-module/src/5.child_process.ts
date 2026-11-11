// 子进程
import { spawn, exec, fork } from "node:child_process";

// spawn 用的最多
const codexTask = spawn("codex", ["--version"]);
// 标准化流式输出
codexTask.stdout.on("data", (data) => {
  console.log(data.toString());
});

// ffmpeg 剪视频
// spawn 用的最多
const ffmpegTask = spawn("ffmpeg", ["-version"]);
// 标准化流式输出
ffmpegTask.stdout.on("data", (data) => {
  console.log(data.toString());
});

exec("codex --version", (error, stdout, stderr) => {
  console.log(stdout);
});
