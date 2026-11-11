import { task } from "@langchain/langgraph";
import { modelWithTools } from "./2.model";
import { BaseMessage, SystemMessage } from "langchain";

export const callLLM = task(
  { name: "callLLM" },
  async (messages: BaseMessage[]) => {
    return modelWithTools.invoke([
      // 提示词
      new SystemMessage("负责对一组数据进行算数运算"),
      ...messages,
    ]);
  },
);
