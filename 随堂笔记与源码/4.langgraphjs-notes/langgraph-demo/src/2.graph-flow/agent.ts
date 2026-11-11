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

// 图状态
const StateAnnotation = Annotation.Root({
  // input: Annotation<string>
  // 笑话的主题
  topic: Annotation<string>,
  // 笑话
  joke: Annotation<string>,
  // 循环判断笑话好不好笑
  improvedJoke: Annotation<string>,
  // 最终笑话
  finalJoke: Annotation<string>,
});

// 先调用模型生成第一版笑话
async function generateJoke(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`帮我写一个笑话，主题是：${state.joke}`);

  return { joke: msg.content };
}

// 判断是否有笑点
function checkPunchline(state: typeof StateAnnotation.State) {
  // 模拟一下
  // 返回值 ”Pass“  ”Fail“
  //   return "Pass";
  return "Fail"; // 判断没有笑点
}

// 改进增强笑话笑点
async function improveJoke(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(`使这个笑话更有趣: ${state.joke}`);
  console.log("🚀 ~ improveJoke ~ msg:", msg);

  return { improveJoke: msg.content };
}

// 通过模型完善笑话
async function polishJoke(state: typeof StateAnnotation.State) {
  const msg = await llm.invoke(
    `添加一个历史典故到这个笑话: ${state.improvedJoke}`,
  );
  console.log("🚀 ~ polishJoke ~ msg:", msg);

  return { finalJoke: msg.content };
}

// 构建整个 langgraph 工作流
const agent = new StateGraph(StateAnnotation)
  .addNode("generateJoke", generateJoke)
  .addNode("improveJoke", improveJoke)
  .addNode("polishJoke", polishJoke)
  .addEdge("__start__", "generateJoke")
  .addConditionalEdges("generateJoke", checkPunchline, {
    Pass: "__end__",
    Fail: "improveJoke",
  })
  .addEdge("improveJoke", "polishJoke")
  .addEdge("polishJoke", "__end__")
  .compile();

async function invoke() {
  const res = await agent.invoke({ topic: "前端开发" }); // 状态
  console.log("🚀 ~ invoke ~ res:", res);
}

invoke();
