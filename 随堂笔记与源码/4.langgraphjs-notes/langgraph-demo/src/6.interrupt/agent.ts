import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import {
  Annotation,
  StateGraph,
  InMemoryStore,
  interrupt,
  MemorySaver,
  Command,
} from "@langchain/langgraph";
import { tool } from "langchain";
import z from "zod";
import { createInterface } from "node:readline/promises";
// import { InMemoryStore } from "langchain";

// 图状态
const StateAnnotation = Annotation.Root({
  url: Annotation<string>,
  times: Annotation<number>,
  text: Annotation<string>,
  // 用户在中断处做出的选择
  approved: Annotation<string>,
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

const interruptNode = (state: typeof StateAnnotation.State) => {
  const approved = interrupt(
    "你看一下我帮你找的这个内容，你满意吗？满意的话我接着让模型帮你处理。",
  );

  return { approved };
};

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

// 定义检查点
const checkpointer = new MemorySaver();

// 6. 定义 agent
export const agent = new StateGraph(StateAnnotation)
  .addNode("fetchTool", fetchToolNode)
  .addNode("modelNode", modelNode)
  .addNode("interrutNode", interruptNode)
  .addEdge("__start__", "fetchTool")
  .addEdge("fetchTool", "interrutNode") // 我帮你找的这些资料你满意吗？
  .addEdge("interrutNode", "modelNode")
  .addEdge("modelNode", "__end__")
  .compile({
    store,
    checkpointer,
  });

const config = { configurable: { thread_id: "thread-1" } };

// 等待用户在终端输入
async function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

async function invoke() {
  const res = await agent.invoke(
    {
      times: 0,
      url: "https://www.baidu.com",
    },
    config,
  );

  console.log(res);

  // 在这里停下来，等用户输入
  const answer = await ask("是否继续执行？（输入「是」继续，输入「否」中断）：");

  if (answer !== "是") {
    console.log("已中断，流程结束。");
    return;
  }

  console.log("好的，你选了，那我开始继续执行");

  // 把用户的回答作为 resume 值传回去，从断点继续执行
  const res2 = await agent.invoke(new Command({ resume: answer }), config);

  console.log(res2);
}

invoke();
