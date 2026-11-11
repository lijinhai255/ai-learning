// 工具都需要有一个标准的协议
import { tool } from "langchain";
import * as z from "zod";

// 加法
const add = tool(({ a, b }) => a + b, {
  name: "add",
  description: "两数相加",
  schema: z.object({
    a: z.number().describe("第一个数字"),
    b: z.number().describe("第二个数字"),
  }), // 在 AI 的世界里约定有现成的方案（typescript：zod，python：pydatic）
}); // 加法怎么算运算法则（函数），配置（对象【Schema 元数据】）

// 减法
const subtract = tool(({ a, b }) => a - b, {
  name: "subtract",
  description: "两数相减",
  schema: z.object({
    a: z.number().describe("被减数"),
    b: z.number().describe("减数"),
  }),
});

// 乘法
const multiply = tool(({ a, b }) => a * b, {
  name: "multiply",
  description: "两数相乘",
  schema: z.object({
    a: z.number().describe("第一个数字"),
    b: z.number().describe("第二个数字"),
  }),
});

// 除法
const divide = tool(({ a, b }) => a / b, {
  name: "divide",
  description: "两数相除",
  schema: z.object({
    a: z.number().describe("被除数"),
    b: z.number().describe("除数"),
  }),
});

export const toolsByName = {
  [add.name]: add,
  [subtract.name]: subtract,
  [multiply.name]: multiply,
  [divide.name]: divide,
};

export const tools = Object.values(toolsByName);
