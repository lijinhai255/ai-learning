import "dotenv/config";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
// src/2.graph-flow/agent2.ts
const llm = new ChatOpenAI({
	model: process.env.MODEL ?? "",
	apiKey: process.env.API_KEY,
	configuration: { baseURL: process.env.BASE_URL }
});
const INTENTS = [
	"售前问题",
	"售后问题",
	"产品咨询问题"
];
const StateAnnotation = Annotation.Root({
	question: Annotation,
	intent: Annotation,
	answer: Annotation
});
async function recognizeIntent(state) {
	const msg = await llm.invoke([
		"你是客服系统的意图识别助手。",
		`请判断用户问题属于哪一类，只回答其中一个词：${INTENTS.join(" / ")}`,
		"",
		`用户问题：${state.question}`
	].join("\n"));
	const text = String(msg.content);
	const intent = INTENTS.find((item) => text.includes(item)) ?? "产品咨询问题";
	console.log("🚀 ~ recognizeIntent ~ intent:", intent);
	return { intent };
}
function routeByIntent(state) {
	return state.intent;
}
async function preSales(state) {
	return { answer: (await llm.invoke(`你是售前客服，负责介绍商品价格、优惠活动和下单流程。请用简洁友好的语气回答用户：${state.question}`)).content };
}
async function afterSales(state) {
	return { answer: (await llm.invoke(`你是售后客服，负责处理退换货、物流查询和维修申请。请用简洁耐心的语气回答用户：${state.question}`)).content };
}
async function productInquiry(state) {
	return { answer: (await llm.invoke(`你是产品咨询客服，负责解答商品参数、功能和使用方法。请用简洁专业的语气回答用户：${state.question}`)).content };
}
const agent = new StateGraph(StateAnnotation).addNode("recognizeIntent", recognizeIntent).addNode("preSales", preSales).addNode("afterSales", afterSales).addNode("productInquiry", productInquiry).addEdge("__start__", "recognizeIntent").addConditionalEdges("recognizeIntent", routeByIntent, {
	售前问题: "preSales",
	售后问题: "afterSales",
	产品咨询问题: "productInquiry"
}).addEdge("preSales", "__end__").addEdge("afterSales", "__end__").addEdge("productInquiry", "__end__").compile();
async function invoke() {
	const res = await agent.invoke({ question: "这个耳机多少钱？" });
	console.log("🚀 ~ invoke ~ res:", res);
}
invoke();
export {};

//# sourceMappingURL=agent2.mjs.map