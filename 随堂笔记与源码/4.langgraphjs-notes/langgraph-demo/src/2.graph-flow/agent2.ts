import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { Annotation, StateGraph } from "@langchain/langgraph";

// 模型的定义
const llm = new ChatOpenAI({
  model: process.env.MODEL ?? "",
  apiKey: process.env.API_KEY,
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});

// 意图的种类
const INTENTS = ["售前问题", "售后问题", "产品咨询问题"] as const;

type Intent = (typeof INTENTS)[number];

// 图状态
const StateAnnotation = Annotation.Root({
  // input：用户的问题
  question: Annotation<string>,
  // 意图识别结果
  intent: Annotation<Intent>,
  // 客服的最终回复
  answer: Annotation<string>,
});

// 意图识别：把用户的问题分类
async function recognizeIntent(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(
    [
      "你是客服系统的意图识别助手。",
      `请判断用户问题属于哪一类，只回答其中一个词：${INTENTS.join(" / ")}`,
      "",
      `用户问题：${state.question}`,
    ].join("\n"),
  );

  // 模型可能多说几个字，取包含的那个意图做兜底
  const text = String(msg.content);
  const intent = INTENTS.find((item) => text.includes(item)) ?? "产品咨询问题";

  console.log("🚀 ~ recognizeIntent ~ intent:", intent);

  return { intent };
}

// 按意图分流，交给不同的节点
function routeByIntent(state: typeof StateAnnotation.State) {
  return state.intent;
}

// 售前问题：价格、优惠、下单
async function preSales(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(
    `你是售前客服，负责介绍商品价格、优惠活动和下单流程。请用简洁友好的语气回答用户：${state.question}`,
  );

  return { answer: msg.content };
}

// 售后问题：退换货、物流、维修
async function afterSales(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(
    `你是售后客服，负责处理退换货、物流查询和维修申请。请用简洁耐心的语气回答用户：${state.question}`,
  );

  return { answer: msg.content };
}

// 产品咨询：参数、功能、使用方法
async function productInquiry(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(
    `你是产品咨询客服，负责解答商品参数、功能和使用方法。请用简洁专业的语气回答用户：${state.question}`,
  );

  return { answer: msg.content };
}

// 构建整个 langgraph 工作流
const agent = new StateGraph(StateAnnotation)
  .addNode("recognizeIntent", recognizeIntent)
  .addNode("preSales", preSales)
  .addNode("afterSales", afterSales)
  .addNode("productInquiry", productInquiry)
  .addEdge("__start__", "recognizeIntent")
  .addConditionalEdges("recognizeIntent", routeByIntent, {
    售前问题: "preSales",
    售后问题: "afterSales",
    产品咨询问题: "productInquiry",
  })
  .addEdge("preSales", "__end__")
  .addEdge("afterSales", "__end__")
  .addEdge("productInquiry", "__end__")
  .compile();

async function invoke() {
  // const res = await agent.invoke({ question: "我买的耳机今天能发货吗？" }); // 状态
  const res = await agent.invoke({ question: "这个耳机多少钱？" }); // 状态
  console.log("🚀 ~ invoke ~ res:", res);
}

invoke();
