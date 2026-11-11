import "dotenv/config"

import { addMessages, entrypoint } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, tool, ToolCall } from "langchain";
import z from "zod";

// 定义工具

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


// 定义模型
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: process.env.MODEL ?? "",
  apiKey: process.env.API_KEY,
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});

const modelWithTools = llm.bindTools(tools);

// 模型调用 node
import { task } from "@langchain/langgraph";
import { SystemMessage } from "langchain";

const callLLM = task({ name: "callLLM" }, async (messages: BaseMessage[]) => {
  return modelWithTools.invoke([
    // 提示词
    new SystemMessage("负责对一组数据进行算数运算"),
    ...messages,
  ]);
});

// 工具调用 node
const callTool = task({ name: "callTool" }, async (toolCall: ToolCall) => {
  const tool = toolsByName[toolCall.name as keyof typeof toolsByName];

  return tool?.invoke(toolCall);
});

// 通过entrypoint 实现 agent
const agent = entrypoint(
  { name: "math-agent" },
  async (messages: BaseMessage[]) => {
    let modelResponse = await callLLM(messages);

    while (true) {
      if (!modelResponse?.tool_calls?.length) {
        break;
      }

      // 执行工具
      const toolResults = await Promise.all(
        modelResponse.tool_calls.map((toolCall) => callTool(toolCall)),
      );
      const validToolResults = toolResults.filter(
        (result) => result !== undefined,
      );
      messages = addMessages(messages, [modelResponse, ...validToolResults]);
      modelResponse = await callLLM(messages);
    }

    return messages
  },
);

// 智能体执行
const invoke = async () => {
  const res = await agent.invoke([new HumanMessage("帮我计算 200 + 100 - 100")]);

  console.log(res);
};

invoke();