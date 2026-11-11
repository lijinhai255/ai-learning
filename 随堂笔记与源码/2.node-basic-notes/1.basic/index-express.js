const express = require('express');
const app = express();

// 定义一个路由
app.get('/', (req, res) => {
  res.send('Hello, Node.js!');
});

// 监听端口 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});