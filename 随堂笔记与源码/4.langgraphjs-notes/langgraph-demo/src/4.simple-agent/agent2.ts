import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import {
  Annotation,
  StateGraph,
  InMemoryStore,
  Send,
} from "@langchain/langgraph";
import { tool } from "langchain";
import z from "zod";

// 图状态
const StateAnnotation = Annotation.Root({
  // 用户给出的主题
  topic: Annotation<string>,
  // 1. analyze 节点分析出的 5 个可借鉴网站
  urls: Annotation<string[]>,
  // 2. 并行 fetch 拿到的网页正文（多个任务同时写入，用 reducer 合并）
  contents: Annotation<string[]>({
    reducer: (prev, next) => prev.concat(next),
    default: () => [],
  }),
  // 3. 最终 model 节点汇总出的结果
  report: Annotation<string>,
});

// 模型每次执行，每次重新给他对话知道之前结果，记忆（上下文）
const store = new InMemoryStore();

// 模型的定义
const llm = new ChatOpenAI({
  model: process.env.MODEL ?? "",
  apiKey: process.env.API_KEY,
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});

// 定义工具
// 爬虫工具
const fetchTool = tool(
  async ({ url }) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });

    return await res.text();
  },
  {
    name: "fetch",
    description: "从给定的 url 获取内容",
    schema: z.object({
      url: z.string().describe("要获取内容的 URL"),
    }),
  },
);

// 从模型返回的文本里兜底提取 URL
function extractUrls(text: string): string[] {
  const matched = text.match(/https?:\/\/[^\s"'<>)\]]+/g) ?? [];
  // 去重，保持出现顺序
  return [...new Set(matched)];
}

// 1. 分析节点：从主题出发，找出 5 个国内可以参考借鉴的网站
async function analyzeNode(state: typeof StateAnnotation.State) {
  const res = await llm.invoke(
    `用户想做一个跟「${state.topic}」相关的产品，需要参考国内同类网站。` +
      `请帮我整理出 5 个国内可以作为借鉴的网站，` +
      `只返回一个 JSON 字符串数组，例如 ["https://a.com", "https://b.com"]，不要任何多余说明。`,
  );

  const urls = extractUrls(String(res.content)).slice(0, 5);
  console.log("🚀 ~ analyzeNode ~ urls:", urls);
  return { urls };
}

// 动态派发：为 analyze 产出的每个 url 生成一个并行的 fetch 任务
function dispatchFetch(state: typeof StateAnnotation.State) {
  return state.urls.map((url) => new Send("fetchTool", { url }));
}

// 2. 爬取节点：由 Send 并行调起，每个任务只携带自己的 url
const fetchToolNode = async (state: { url: string }) => {
  try {
    const res = await fetchTool.invoke({ url: state.url });
    console.log("🚀 ~ fetchToolNode ~ url:", state.url);
    return { contents: [String(res)] };
  } catch (err) {
    console.log("🚀 ~ fetchToolNode ~ 抓取失败:", state.url, err);
    return { contents: [`抓取失败：${state.url}`] };
  }
};

// 3. 汇总节点：所有并行 fetch 完成后（同步屏障），统一交给模型生成最终结果
async function modelNode(state: typeof StateAnnotation.State) {
  const res = await llm.invoke(
    `用户想做一个跟「${state.topic}」相关的产品，` +
      `下面是参考网站在抓取到的内容，请帮我汇总分析，并给出可借鉴的要点：\n\n` +
      state.contents.join("\n\n"),
  );
  console.log("🚀 ~ modelNode ~ msg:", res.content);
  return { report: String(res.content) };
}

// 6. 定义 agent
export const agent = new StateGraph(StateAnnotation)
  .addNode("analyze", analyzeNode)
  .addNode("fetchTool", fetchToolNode)
  .addNode("modelNode", modelNode)
  .addEdge("__start__", "analyze")
  // 关键：条件边返回 Send[]，为每个 url 并行派发一个 fetch 任务（map-reduce）
  .addConditionalEdges("analyze", dispatchFetch)
  .addEdge("fetchTool", "modelNode")
  .addEdge("modelNode", "__end__")
  .compile({
    store,
  });

async function invoke() {
  const res = await agent.invoke({
    // topic: "在线教育知识付费平台",
    topic: "花艺",
  });

  console.log(res);
}

invoke();
