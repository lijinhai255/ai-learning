import { Document } from "@langchain/core/documents";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import { splitText } from "./2.split.ts";
import { embeddings } from "./3.embedding.ts";

/**
 * 第四步（方案一）：内存向量存储
 * 向量只存在当前进程的内存里，程序一关就没了，适合学习和快速验证
 */
export const createMemoryVectorStore = async () => {
  const texts = await splitText();

  const vectorstore = await MemoryVectorStore.fromDocuments(
    texts.map((text) => new Document({ pageContent: text })),
    embeddings,
  );

  return vectorstore;
};

/** 用一句query去检索最相似的 k 片文本 */
export const searchMemoryVectorStore = async (query: string, k = 3) => {
  const vectorstore = await createMemoryVectorStore();

  const results = await vectorstore.similaritySearchWithScore(query, k);
  console.log("🚀 ~ searchMemoryVectorStore ~ results:", results);

  return results;
};

// 直接运行本文件时执行：node src/1.base-rag/4.memory-store.ts
if (process.argv[1] === import.meta.filename) {
  await searchMemoryVectorStore("再见");
}
