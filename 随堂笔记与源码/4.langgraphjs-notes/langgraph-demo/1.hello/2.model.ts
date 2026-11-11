// 大语言模型，LLM，deepseek-v4.1-flash
// 图片模型，image-2
// 视频模型，seedance
// 语言识别 asr，whisper
// 文本生成语音 tts，indextts2、cosyvoice
import { tools } from "./1.tools";
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
  model: process.env.MODEL ?? "",
  apiKey: process.env.API_KEY,
  configuration: {
    baseURL: process.env.BASE_URL,
  },
});

export const modelWithTools = llm.bindTools(tools);
