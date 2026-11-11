import path from "node:path";

import { SRTLoader } from "@langchain/community/document_loaders/fs/srt";

// 其他格式的 Loader，按需打开注释
// import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
// import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

/** 示例文档目录：rag/rga-document */
const documentDir = path.resolve(import.meta.dirname, "../../rga-document");

/**
 * 第一步：文档加载
 * Loader 把不同格式的文件读成 LangChain 的 Document 对象，结构为 { pageContent, metadata }
 */
export const loadDocument = async () => {
  const loader = new SRTLoader(path.resolve(documentDir, "sample.srt"));

  // CSV：student.csv 每一行都会变成一条 Document
  // const loader = new CSVLoader(path.resolve(documentDir, "student.csv"));

  // Word：sample.docx 整篇正文会变成一条 Document
  // const loader = new DocxLoader(path.resolve(documentDir, "sample.docx"));

  const data = await loader.load();
  console.log("🚀 ~ loadDocument ~ data:", data);

  return data;
};

// 直接运行本文件时执行：node src/1.base-rag/1.load.ts
if (process.argv[1] === import.meta.filename) {
  await loadDocument();
}
