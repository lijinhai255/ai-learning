import dgram from "node:dgram";

const socket1 = dgram.createSocket("udp4");
const socket2 = dgram.createSocket("udp4");

socket1.setMaxListeners(1);
socket2.setMaxListeners(1);

socket1.bind(8080, "127.0.0.1", () => {
  console.log('启动成功')
});

socket1.on("message", (buffer, rinfo) => {
  console.log("数据", buffer.toString());
  console.log("客户端地址", rinfo.address);
  console.log('客户端端口', rinfo.port)
})


socket2.bind(8081, "127.0.0.1", () => {
  console.log('启动成功')
});

socket2.on("message", (buffer, rinfo) => {
  console.log("数据", buffer.toString());
  console.log("客户端地址", rinfo.address);
  console.log('客户端端口', rinfo.port)
})
