import { addMessages, entrypoint } from "@langchain/langgraph";
import { BaseMessage } from "langchain";
import { callLLM } from "./3.model-node";
import { callTool } from "./4.tool-node";

export const agent = entrypoint(
  { name: "math-agent" },
  async (messages: BaseMessage[]) => {
    let modelResponse = await callLLM(messages);

    while (true) {
      if (!modelResponse?.tool_calls?.length) {
        break;
      }

      // 执行工具
      const toolResults = await Promise.all(
        modelResponse.tool_calls.map((toolCall) => callTool(toolCall)),
      );
      const validToolResults = toolResults.filter(
        (result) => result !== undefined,
      );
      messages = addMessages(messages, [modelResponse, ...validToolResults]);
      modelResponse = await callLLM(messages);
    }
  },
);
