import { task } from "@langchain/langgraph";
import { toolsByName } from "./1.tools";
import type { ToolCall } from "@langchain/core/messages";

export const callTool = task(
  { name: "callTool" },
  async (toolCall: ToolCall) => {
    const tool = toolsByName[toolCall.name as keyof typeof toolsByName];

    return tool?.invoke(toolCall);
  },
);
