// http 作为客户端
// 爬虫客户端，代理
// request、axios
import http from "node:http";

// http.get("http://www.baidu.com", (res) => {
// //   console.log(res);

//   let data = "";
//   res.on("data", (chunk) => {
//     console.log('🚀 ~ chunk:', chunk)
//     data += chunk;
//   });

//   res.on("end", () => {
//     console.log(data);
//   });
// });
const req = http.request(
  {
    hostname: "www.baidu.com",
    port: 80,
    method: "GET",
  },
  (res) => {
    //   console.log(res);

    let data = "";
    res.on("data", (chunk) => {
      console.log("🚀 ~ chunk:", chunk);
      data += chunk;
    });

    res.on("end", () => {
      console.log(data);
    });
  },
);
req.end();


// 流
// AI 流式输出