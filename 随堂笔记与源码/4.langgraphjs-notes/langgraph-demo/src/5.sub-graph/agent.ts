import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { Annotation, StateGraph, InMemoryStore } from "@langchain/langgraph";
import { tool } from "langchain";
import z from "zod";
// import { InMemoryStore } from "langchain";

// 图状态
const StateAnnotation = Annotation.Root({
  url: Annotation<string>,
  times: Annotation<number>,
  text: Annotation<string>,
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
    const res = await fetch(url);

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

const fetchToolNode = async (state: typeof StateAnnotation.State) => {
  const res = await fetchTool.invoke({ url: state.url });
  console.log("🚀 ~ fetchToolNode ~ res:", res);

  return { times: state.times + 1, text: res };
};

async function modelNode(state: typeof StateAnnotation.State) {
  const res = await llm.invoke(
    `用户爬取的是这个内容，你帮我分析一下这个内容的价值，${state.text}`,
  );
  console.log("🚀 ~ modelNode ~ msg:", res.content);
  return { times: state.times };
}

// 6. 定义 agent
export const subAgent = new StateGraph(StateAnnotation)
  .addNode("fetchTool", fetchToolNode)
  .addNode("modelNode", modelNode)
  .addEdge("__start__", "fetchTool")
  .addEdge("fetchTool", "modelNode")
  .addEdge("modelNode", "__end__")
  .compile({
    store,
  });

export const agent = new StateGraph(StateAnnotation)
  .addNode("fetchTool", fetchToolNode)
  .addNode("modelNode", modelNode)
  .addNode("subAgent1", async () => {
    // 子图当工具
    const subgraphOutput = await subAgent.invoke({
      times: 0,
      url: "https://www.baidu.com",
    });
    console.log("🚀 ~ subgraphOutput:", subgraphOutput);

    return {};
  })
  .addNode("subAgent2", async () => {
    // 子图当工具
    const subgraphOutput = await subAgent.invoke({
      times: 0,
      url: "https://www.baidu.com",
    });
    console.log("🚀 ~ subgraphOutput:", subgraphOutput);

    return {};
  })
  .addEdge("__start__", "fetchTool")
  .addEdge("fetchTool", "subAgent1")
  .addEdge("subAgent1", "subAgent2")
  .addEdge("subAgent2", "modelNode")
  .addEdge("modelNode", "__end__")
  .compile({
    store,
  });

async function invoke() {
  const res = await agent.invoke({
    times: 0,
    url: "https://www.baidu.com",
  });

  console.log(res);
}

invoke();
