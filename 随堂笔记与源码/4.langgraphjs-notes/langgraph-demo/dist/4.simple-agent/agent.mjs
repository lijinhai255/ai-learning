import "dotenv/config";
import { Annotation, InMemoryStore, StateGraph } from "@langchain/langgraph";
import { tool } from "langchain";
import z from "zod";
import { ChatOpenAI } from "@langchain/openai";
// src/4.simple-agent/agent.ts
const StateAnnotation = Annotation.Root({
	url: Annotation,
	times: Annotation,
	text: Annotation
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
const agent = new StateGraph(StateAnnotation).addNode("fetchTool", fetchToolNode).addNode("modelNode", modelNode).addEdge("__start__", "fetchTool").addEdge("fetchTool", "modelNode").addEdge("modelNode", "__end__").compile({ store });
async function invoke() {
	const res = await agent.invoke({
		times: 0,
		url: "https://www.baidu.com"
	});
	console.log(res);
}
invoke();
export { agent };

//# sourceMappingURL=agent.mjs.map