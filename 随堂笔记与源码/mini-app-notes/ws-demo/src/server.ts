// http 模块使用
// 导入模块
import http from "node:http";
import crypto from "node:crypto";

const server = http.createServer((req, res) => {
  res.writeHead(400);
  res.end("当前服务是 ws 服务，无法直接访问");
});

// 将这个服务升级为 ws
server.on("upgrade", (req, socket, head) => {
  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
  }
  // 我们需要生成 sec-websocket-accept
  const acceptValue = generateAcceptValue(key);
  const headers = [
    "HTTP/1.1 101 Switching Protocols",
    "Upgrade: websocket",
    "Connection: Upgrade",
    `Sec-WebSocket-Accept: ${acceptValue}`,
  ];
  console.log("🚀 ~ server.on ~ req:", socket, head);
  // 现在是通过 socket 返回，而不是 res
  socket.write(headers.join("\r\n") + "\r\n\r\n");

  // 监听客户端数据
  socket.on("data", (data) => {
    // buffer 是数据帧，直接 toString 会乱码

    // 前端过来数据也需要进行解析

    // 服务端返回的数据也需要解析
    socket.write(generateWebsocketFrame("pong"));
  });
});

// 端口监听
server.listen(3000, () => {
  console.log("服务启动成功，端口3000，localhost:3000");
});

function generateAcceptValue(key: string) {
  return crypto
    .createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`, "binary")
    .digest("base64");
}

// 数据帧生成
function generateWebsocketFrame(data: string) {
  // buffer 处理
  const message = Buffer.from(data);
  // 转化 websocket 数据帧
  const frame = Buffer.alloc(2 + message.length);
  frame[0] = 0x81; // 十六进制的数据    0b1000001  十进制：129
  frame[1] = message.length;
  // 将原数据复制到 frame 中
  message.copy(frame, 2);

  return frame;
}
