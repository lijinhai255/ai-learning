import "dotenv/config";
import { addMessages, entrypoint, task } from "@langchain/langgraph";
import { HumanMessage, SystemMessage, tool } from "langchain";
import z from "zod";
import { ChatOpenAI } from "@langchain/openai";
// src/1.hello/agent2.ts
const add = tool(({ a, b }) => a + b, {
	name: "add",
	description: "两数相加",
	schema: z.object({
		a: z.number().describe("第一个数字"),
		b: z.number().describe("第二个数字")
	})
});
const subtract = tool(({ a, b }) => a - b, {
	name: "subtract",
	description: "两数相减",
	schema: z.object({
		a: z.number().describe("被减数"),
		b: z.number().describe("减数")
	})
});
const multiply = tool(({ a, b }) => a * b, {
	name: "multiply",
	description: "两数相乘",
	schema: z.object({
		a: z.number().describe("第一个数字"),
		b: z.number().describe("第二个数字")
	})
});
const divide = tool(({ a, b }) => a / b, {
	name: "divide",
	description: "两数相除",
	schema: z.object({
		a: z.number().describe("被除数"),
		b: z.number().describe("除数")
	})
});
const toolsByName = {
	[add.name]: add,
	[subtract.name]: subtract,
	[multiply.name]: multiply,
	[divide.name]: divide
};
const tools = Object.values(toolsByName);
const modelWithTools = new ChatOpenAI({
	model: process.env.MODEL ?? "",
	apiKey: process.env.API_KEY,
	configuration: { baseURL: process.env.BASE_URL }
}).bindTools(tools);
const callLLM = task({ name: "callLLM" }, async (messages) => {
	return modelWithTools.invoke([new SystemMessage("负责对一组数据进行算数运算"), ...messages]);
});
const callTool = task({ name: "callTool" }, async (toolCall) => {
	return toolsByName[toolCall.name]?.invoke(toolCall);
});
const agent = entrypoint({ name: "math-agent" }, async (messages) => {
	let modelResponse = await callLLM(messages);
	while (true) {
		if (!modelResponse?.tool_calls?.length) break;
		const validToolResults = (await Promise.all(modelResponse.tool_calls.map((toolCall) => callTool(toolCall)))).filter((result) => result !== void 0);
		messages = addMessages(messages, [modelResponse, ...validToolResults]);
		modelResponse = await callLLM(messages);
	}
	return messages;
});
const invoke = async () => {
	const res = await agent.invoke([new HumanMessage("帮我计算 200 + 100 - 100")]);
	console.log(res);
};
invoke();
export { tools, toolsByName };

//# sourceMappingURL=agent2.mjs.map