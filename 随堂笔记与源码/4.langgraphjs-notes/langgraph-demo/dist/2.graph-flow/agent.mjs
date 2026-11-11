import "dotenv/config";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
// src/2.graph-flow/agent.ts
const llm = new ChatOpenAI({
	model: process.env.MODEL ?? "",
	apiKey: process.env.API_KEY,
	configuration: { baseURL: process.env.BASE_URL }
});
const StateAnnotation = Annotation.Root({
	topic: Annotation,
	joke: Annotation,
	improvedJoke: Annotation,
	finalJoke: Annotation
});
async function generateJoke(state) {
	return { joke: (await llm.invoke(`帮我写一个笑话，主题是：${state.joke}`)).content };
}
function checkPunchline(state) {
	return "Fail";
}
async function improveJoke(state) {
	const msg = await llm.invoke(`使这个笑话更有趣: ${state.joke}`);
	console.log("🚀 ~ improveJoke ~ msg:", msg);
	return { improveJoke: msg.content };
}
async function polishJoke(state) {
	const msg = await llm.invoke(`添加一个历史典故到这个笑话: ${state.improvedJoke}`);
	console.log("🚀 ~ polishJoke ~ msg:", msg);
	return { finalJoke: msg.content };
}
const agent = new StateGraph(StateAnnotation).addNode("generateJoke", generateJoke).addNode("improveJoke", improveJoke).addNode("polishJoke", polishJoke).addEdge("__start__", "generateJoke").addConditionalEdges("generateJoke", checkPunchline, {
	Pass: "__end__",
	Fail: "improveJoke"
}).addEdge("improveJoke", "polishJoke").addEdge("polishJoke", "__end__").compile();
async function invoke() {
	const res = await agent.invoke({ topic: "前端开发" });
	console.log("🚀 ~ invoke ~ res:", res);
}
invoke();
export {};

//# sourceMappingURL=agent.mjs.map