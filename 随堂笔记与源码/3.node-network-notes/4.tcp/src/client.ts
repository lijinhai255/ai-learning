import net from "node:net";

const client = net.createConnection({
    port: 8080,
    host: "127.0.0.1" // localhost，服务端应用，最好忘掉 localhost，docker
}, () => {
    console.log('连接成功')

    let count = 0;
    // 每秒自增 1 并发送给服务端，附带换行方便服务端按行切分
    const timer = setInterval(() => {
        count += 1;
        client.write(`${count}\n`);
    }, 1000);

    client.on('close', () => {
        clearInterval(timer);
    });
})

client.on('error', (err) => {
    console.error('client error:', err);
});
