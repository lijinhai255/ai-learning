import net from "node:net";

const server = net.createServer((socket) => {
  console.log("连接了");

  socket.on("data", (buffer) => {
    console.log(buffer.toString());

    socket.write("我收到了你的信息");
  });
});

server.listen(8080, () => {
  console.log("服务已启动");
});
