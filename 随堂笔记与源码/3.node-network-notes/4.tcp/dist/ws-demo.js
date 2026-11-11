import { WebSocketServer } from "ws";
const ws = new WebSocketServer({ port: 8080 });
ws.on("connection", function connection(ws) {
    ws.on("error", console.error);
    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });
    // 每秒向前端发送一次
    let count = 0;
    ws.send("something");
    const timer = setInterval(() => {
        ws.send(count);
        count += 1;
    }, 1000);
    // 客户端断开时清理定时器，避免泄漏
    ws.on("close", () => {
        clearInterval(timer);
    });
});
//# sourceMappingURL=ws-demo.js.map