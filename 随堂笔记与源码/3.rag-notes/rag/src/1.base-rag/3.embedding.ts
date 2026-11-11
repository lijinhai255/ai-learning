import "dotenv/config";

import { OpenAIEmbeddings } from "@langchain/openai";

import { splitText } from "./2.split.ts";

function getEnv(key: string) {
  return process.env[key] || "";
}

/**
 * 第三步：Embedding
 * 把文本转换成向量，是「文本 → 相似度」之间唯一的桥梁
 */
export const embeddings = new OpenAIEmbeddings({
  model: getEnv("EMBEDDING_MODEL"),
  apiKey: getEnv("API_KEY"),
  configuration: {
    baseURL: getEnv("BASE_URL"),
  },
});

/** 把切好的每一片文本批量转成向量 */
export const embeddingDocument = async () => {
  const texts = await splitText();

  const vectors = await embeddings.embedDocuments(texts);
  console.log("🚀 ~ embeddingDocument ~ vectors:", vectors[0]);

  return vectors;
};

// 直接运行本文件时执行：node src/1.base-rag/3.embedding.ts
if (process.argv[1] === import.meta.filename) {
  await embeddingDocument();
}
