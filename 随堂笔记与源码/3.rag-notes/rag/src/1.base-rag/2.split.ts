import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { loadDocument } from "./1.load.ts";

/**
 * 第二步：切片（文本分割）
 * chunkSize 控制每片长度，chunkOverlap 让相邻片段有重叠，避免语义被切断
 */
export const splitText = async () => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 50,
    chunkOverlap: 10,
  });

  const doc = await loadDocument();

  const chunks = await splitter.splitText(doc[0]?.pageContent ?? "");
  console.log("🚀 ~ splitText ~ chunks:", chunks);

  return chunks;
};

// 直接运行本文件时执行：node src/1.base-rag/2.split.ts
if (process.argv[1] === import.meta.filename) {
  await splitText();
}
