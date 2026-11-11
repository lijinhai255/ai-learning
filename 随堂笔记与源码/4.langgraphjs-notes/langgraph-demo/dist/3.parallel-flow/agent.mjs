import "dotenv/config";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
// src/3.parallel-flow/agent.ts
const llm = new ChatOpenAI({
	model: process.env.MODEL ?? "",
	apiKey: process.env.API_KEY,
	configuration: { baseURL: process.env.BASE_URL }
});
const StateAnnotation = Annotation.Root({
	topic: Annotation,
	joke: Annotation,
	story: Annotation,
	poem: Annotation,
	combinedOutput: Annotation
});
async function callLlm1(state) {
	return { joke: (await llm.invoke(`写一个关于 ${state.topic} 主题的笑话`)).content };
}
async function callLlm2(state) {
	return { story: (await llm.invoke(`写一个关于 ${state.topic} 主题的故事`)).content };
}
async function callLlm3(state) {
	return { poem: (await llm.invoke(`写一个关于 ${state.topic} 主题的诗歌`)).content };
}
async function aggregator(state) {
	return { combinedOutput: `这里有一个关于 ${state.topic} 的故事、笑话和诗歌!\n\n故事:\n${state.story}\n\n笑话:\n${state.joke}\n\n诗歌:\n${state.poem}` };
}
const agent = new StateGraph(StateAnnotation).addNode("callLlm1", callLlm1).addNode("callLlm2", callLlm2).addNode("callLlm3", callLlm3).addNode("aggregator", aggregator).addEdge("__start__", "callLlm1").addEdge("__start__", "callLlm2").addEdge("__start__", "callLlm3").addEdge("callLlm1", "aggregator").addEdge("callLlm2", "aggregator").addEdge("callLlm3", "aggregator").addEdge("aggregator", "__end__").compile();
async function invoke() {
	const res = await agent.invoke({ topic: "前端开发" });
	console.log("🚀 ~ invoke ~ res:", res);
}
invoke();
export {};

//# sourceMappingURL=agent.mjs.map