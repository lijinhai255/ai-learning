import http from "node:http";
import crypto from "node:crypto";
// 既然我们确定了这个是 ws 服务，http 访问给你报错
const app = http.createServer((req, res) => {
    res.writeHead(400);
    res.end("当前服务是 ws 服务，无法直接通过 http 访问。");
});
// 将服务升级为 ws
app.on("upgrade", (req, socket, head) => {
    const key = req.headers["sec-websocket-key"];
    console.log("🚀 ~ key:", key);
    if (!key) {
        socket.destroy();
        return;
    }
    // 服务端生成的 accept
    const acceptValue = generateAcceptValue(key);
    // 封装响应头
    const headers = [
        "HTTP/1.1 101 Switching Protocols",
        "Upgrade: websocket",
        "Connection: Upgrade",
        `Sec-WebSocket-Accept: ${acceptValue}`,
    ];
    socket.write(headers.join("\r\n") + "\r\n\r\n");
    // 监听客户端数据
    socket.on("data", (data) => {
        console.log("🚀 ~ data:", data);
        // 看客户端发了个 ping
        // 我们要返回 pong
        socket.write(generateWebsocketFrame("hello"));
    });
});
app.listen(3000);
function generateAcceptValue(key) {
    return crypto
        .createHash("sha1")
        .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`, "binary")
        .digest("base64");
}
function generateWebsocketFrame(data) {
    // buffer
    const message = Buffer.from(data);
    // 转换为 WebSocket 数据帧
    const frame = Buffer.alloc(2 + message.length);
    frame[0] = 0x81; // 十进制：129，0b100001
    frame[1] = message.length;
    // 将原来数据复制到 frame
    message.copy(frame, 2);
    console.log('🚀 ~ generateWebsocketFrame ~ frame:', frame);
    return frame;
}
//# sourceMappingURL=server.js.map