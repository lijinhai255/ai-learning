import "dotenv/config";
import { Annotation, InMemoryStore, Send, StateGraph } from "@langchain/langgraph";
import { tool } from "langchain";
import z from "zod";
import { ChatOpenAI } from "@langchain/openai";
// src/4.simple-agent/agent2.ts
const StateAnnotation = Annotation.Root({
	topic: Annotation,
	urls: Annotation,
	contents: Annotation({
		reducer: (prev, next) => prev.concat(next),
		default: () => []
	}),
	report: Annotation
});
const store = new InMemoryStore();
const llm = new ChatOpenAI({
	model: process.env.MODEL ?? "",
	apiKey: process.env.API_KEY,
	configuration: { baseURL: process.env.BASE_URL }
});
const fetchTool = tool(async ({ url }) => {
	return await (await fetch(url, { signal: AbortSignal.timeout(15e3) })).text();
}, {
	name: "fetch",
	description: "从给定的 url 获取内容",
	schema: z.object({ url: z.string().describe("要获取内容的 URL") })
});
function extractUrls(text) {
	const matched = text.match(/https?:\/\/[^\s"'<>)\]]+/g) ?? [];
	return [...new Set(matched)];
}
async function analyzeNode(state) {
	const res = await llm.invoke(`用户想做一个跟「${state.topic}」相关的产品，需要参考国内同类网站。请帮我整理出 5 个国内可以作为借鉴的网站，只返回一个 JSON 字符串数组，例如 ["https://a.com", "https://b.com"]，不要任何多余说明。`);
	const urls = extractUrls(String(res.content)).slice(0, 5);
	console.log("🚀 ~ analyzeNode ~ urls:", urls);
	return { urls };
}
function dispatchFetch(state) {
	return state.urls.map((url) => new Send("fetchTool", { url }));
}
const fetchToolNode = async (state) => {
	try {
		const res = await fetchTool.invoke({ url: state.url });
		console.log("🚀 ~ fetchToolNode ~ url:", state.url);
		return { contents: [String(res)] };
	} catch (err) {
		console.log("🚀 ~ fetchToolNode ~ 抓取失败:", state.url, err);
		return { contents: [`抓取失败：${state.url}`] };
	}
};
async function modelNode(state) {
	const res = await llm.invoke(`用户想做一个跟「${state.topic}」相关的产品，下面是参考网站在抓取到的内容，请帮我汇总分析，并给出可借鉴的要点：\n\n` + state.contents.join("\n\n"));
	console.log("🚀 ~ modelNode ~ msg:", res.content);
	return { report: String(res.content) };
}
const agent = new StateGraph(StateAnnotation).addNode("analyze", analyzeNode).addNode("fetchTool", fetchToolNode).addNode("modelNode", modelNode).addEdge("__start__", "analyze").addConditionalEdges("analyze", dispatchFetch).addEdge("fetchTool", "modelNode").addEdge("modelNode", "__end__").compile({ store });
async function invoke() {
	const res = await agent.invoke({ topic: "花艺" });
	console.log(res);
}
invoke();
export { agent };

//# sourceMappingURL=agent2.mjs.map