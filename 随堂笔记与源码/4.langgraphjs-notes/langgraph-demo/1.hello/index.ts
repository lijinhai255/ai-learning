// 业务
// 节点代表了处理逻辑
// 边决定了业务流程

// 算数运算的智能体
// + - * /

// 每一个运算都是一个工具
// 计算、推导 节点
// 串成一个公式 边
import "dotenv/config";

import { agent } from "./agent";
import { HumanMessage } from "langchain";

// const invoke = async () => {
//   const res = agent.invoke([new HumanMessage("帮我计算 1 + 4")]);

//   console.log(res);
// };

// invoke();
