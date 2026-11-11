export default (ctx, options) => {
  // plugin 主体
  ctx.onBuildStart(() => {
    console.log("🚀 ~ options:", options);
    console.log("编译开始！");
  });
  ctx.onBuildFinish(() => {
    console.log("Webpack 编译结束！");
  });
  ctx.onBuildComplete(() => {
    console.log("Taro 构建完成！");
  });

  ctx.registerCommand({
    // 命令名
    name: "miaoma",
    // 执行 taro upload --help 时输出的 options 信息
    optionsMap: {
      "--remote": "服务器地址",
    },
    // 命令处理逻辑
    async fn() {
      console.log("妙码");
    },
  });
};
