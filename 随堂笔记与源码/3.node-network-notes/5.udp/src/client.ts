import dgram from "node:dgram";

const client = dgram.createSocket("udp4");

let count = 0;
// 每秒自增 1 并发送给服务端，附带换行方便服务端按行切分
const timer = setInterval(() => {
  count += 1;
  client.send(`${count}\n`, 8080, "127.0.0.1");
}, 1000);

client.on("close", () => {
  clearInterval(timer);
});
