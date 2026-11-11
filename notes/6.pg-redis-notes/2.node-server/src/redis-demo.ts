import { createClient } from "redis";

const client = createClient({
  //   host: "127.0.0.1",
  //   port: 6379,
  // redis[s]://[[username][:password]@][host][:port][/db-number]
  url: "redis://default:heyiredis@127.0.0.1:6379",
});

client.connect();

client.on("connect", async () => {
  console.log("redis client connected");

  // 进行操作了...
  const cv =  await client.get("cversion")
  console.log('🚀 ~ cv:', cv)

  const h =  await client.sMembers("hobby")
  console.log('🚀 ~ h:', h)
  


});
