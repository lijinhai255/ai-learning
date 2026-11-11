import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { Annotation, StateGraph } from "@langchain/langgraph";

// graph engineering
// 多智能体协作
// langgraph 子图

// 我要写首诗、写篇散文、写一个故事
// 前端、后端开发并行，给到测试

// 模型的定义
const llm = new ChatOpenAI({
  model: process.env.MODEL ?? "",
  apiKey: process.env.API_KEY,
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});

// 图状态
const StateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  joke: Annotation<string>,
  story: Annotation<string>,
  poem: Annotation<string>,
  combinedOutput: Annotation<string>,
});

async function callLlm1(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`写一个关于 ${state.topic} 主题的笑话`);
  return { joke: msg.content };
}

// 第二个 LLM 调用，生成故事
async function callLlm2(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`写一个关于 ${state.topic} 主题的故事`);
  return { story: msg.content };
}

// 第三个 LLM 调用，生成诗歌
async function callLlm3(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`写一个关于 ${state.topic} 主题的诗歌`);
  return { poem: msg.content };
}

// 合并节点，将笑话、故事和诗歌合并为一个输出
async function aggregator(state: typeof StateAnnotation.State) {
  const combined =
    `这里有一个关于 ${state.topic} 的故事、笑话和诗歌!\n\n` +
    `故事:\n${state.story}\n\n` +
    `笑话:\n${state.joke}\n\n` +
    `诗歌:\n${state.poem}`;
  return { combinedOutput: combined };
}

// 构建整个 langgraph 工作流
const agent = new StateGraph(StateAnnotation)
  .addNode("callLlm1", callLlm1)
  .addNode("callLlm2", callLlm2)
  .addNode("callLlm3", callLlm3)
  .addNode("aggregator", aggregator)
  .addEdge("__start__", "callLlm1")
  .addEdge("__start__", "callLlm2")
  .addEdge("__start__", "callLlm3")
  .addEdge("callLlm1", "aggregator")
  .addEdge("callLlm2", "aggregator")
  .addEdge("callLlm3", "aggregator")
  .addEdge("aggregator", "__end__")
  .compile();

async function invoke() {
  const res = await agent.invoke({ topic: "前端开发" }); // 状态
  console.log("🚀 ~ invoke ~ res:", res);
}

invoke();
