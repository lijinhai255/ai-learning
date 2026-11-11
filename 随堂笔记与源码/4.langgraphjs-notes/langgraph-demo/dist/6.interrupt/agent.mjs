import "dotenv/config";
import { Annotation, Command, InMemoryStore, MemorySaver, StateGraph, interrupt } from "@langchain/langgraph";
import { tool } from "langchain";
import z from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { createInterface } from "node:readline/promises";
// src/6.interrupt/agent.ts
const StateAnnotation = Annotation.Root({
	url: Annotation,
	times: Annotation,
	text: Annotation,
	approved: Annotation
});
const store = new InMemoryStore();
const llm = new ChatOpenAI({
	model: process.env.MODEL ?? "",
	apiKey: process.env.API_KEY,
	configuration: { baseURL: process.env.BASE_URL }
});
const fetchTool = tool(async ({ url }) => {
	return await (await fetch(url)).text();
}, {
	name: "fetch",
	description: "从给定的 url 获取内容",
	schema: z.object({ url: z.string().describe("要获取内容的 URL") })
});
const interruptNode = (state) => {
	return { approved: interrupt("你看一下我帮你找的这个内容，你满意吗？满意的话我接着让模型帮你处理。") };
};
const fetchToolNode = async (state) => {
	const res = await fetchTool.invoke({ url: state.url });
	console.log("🚀 ~ fetchToolNode ~ res:", res);
	return {
		times: state.times + 1,
		text: res
	};
};
async function modelNode(state) {
	const res = await llm.invoke(`用户爬取的是这个内容，你帮我分析一下这个内容的价值，${state.text}`);
	console.log("🚀 ~ modelNode ~ msg:", res.content);
	return { times: state.times };
}
const checkpointer = new MemorySaver();
const agent = new StateGraph(StateAnnotation).addNode("fetchTool", fetchToolNode).addNode("modelNode", modelNode).addNode("interrutNode", interruptNode).addEdge("__start__", "fetchTool").addEdge("fetchTool", "interrutNode").addEdge("interrutNode", "modelNode").addEdge("modelNode", "__end__").compile({
	store,
	checkpointer
});
const config = { configurable: { thread_id: "thread-1" } };
async function ask(question) {
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout
	});
	const answer = await rl.question(question);
	rl.close();
	return answer.trim();
}
async function invoke() {
	const res = await agent.invoke({
		times: 0,
		url: "https://www.baidu.com"
	}, config);
	console.log(res);
	const answer = await ask("是否继续执行？（输入「是」继续，输入「否」中断）：");
	if (answer !== "是") {
		console.log("已中断，流程结束。");
		return;
	}
	console.log("好的，你选了，那我开始继续执行");
	const res2 = await agent.invoke(new Command({ resume: answer }), config);
	console.log(res2);
}
invoke();
export { agent };

//# sourceMappingURL=agent.mjs.map