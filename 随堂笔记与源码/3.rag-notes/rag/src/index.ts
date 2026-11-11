import "dotenv/config";
import path from "node:path";

// import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
// const loader = new CSVLoader(
//   path.resolve(import.meta.dirname, "../rga-document/student.csv"),
// );

import { SRTLoader } from "@langchain/community/document_loaders/fs/srt";

const loader = new SRTLoader(
  //   path.resolve(import.meta.dirname, "../rga-document/student.csv"),
  path.resolve(import.meta.dirname, "../rga-document/sample.srt"),
);

// import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

// const loader = new DocxLoader(
//   //   path.resolve(import.meta.dirname, "../rga-document/student.csv"),
//   path.resolve(import.meta.dirname, "../rga-document/sample.docx"),
// );

console.log(process.env.BASE_URL);

// 文档加载
export const loadDocument = async () => {
  const data = await loader.load();
  //   console.log("🚀 ~ loadDocument ~ data:", data);

  return data;
};

loadDocument();

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitText = async () => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 50,
    chunkOverlap: 10,
  });

  const doc = await loadDocument();

  const chunks = await splitter.splitText(doc[0]?.pageContent);
  console.log("🚀 ~ splitText ~ chunks:", chunks);

  return chunks;
};

splitText();

import { OpenAIEmbeddings } from "@langchain/openai";

import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { PoolConfig } from "pg";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";

const embeddings = new OpenAIEmbeddings({
  model: getEnv("EMBEDDING_MODEL"),
  apiKey: getEnv("API_KEY"),
  configuration: {
    baseURL: getEnv("BASE_URL"),
  },
});
const embeddingDocument = async () => {
  const texts = await splitText();

  const vectors = await embeddings.embedDocuments(texts);
  //   console.log("🚀 ~ enbeddingDocument ~ vectors:", vectors[0]);

  //   const vectorstore = await MemoryVectorStore.fromDocuments(
  //     texts.map((text) => new Document({ pageContent: text })),
  //     embeddings,
  //   );

  //   return vectorstore;

  const config = {
    postgresConnectionOptions: {
      type: "postgres",
      host: "127.0.0.1",
      port: 5432,
      user: "postgres",
      password: "heyi",
      database: "embedding",
    } as PoolConfig,
    tableName: "heyilangchainjs",
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
    // supported distance strategies: cosine (default), innerProduct, or euclidean
    distanceStrategy: "cosine" as DistanceStrategy,
  };

  const vectorstore = await PGVectorStore.initialize(embeddings, config);
  vectorstore.addDocuments(
    texts.map(
      (text, index) => new Document({ pageContent: text, id: `${index}` }),
    ),
  );
  //   vectorstore.addDocuments([new Document({ pageContent: texts[0] ?? "" })]);

  return vectorstore;
  //   return vectors;
};

// embeddingDocument();

// 接模型
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";

// baseURL
// model
// apiKey

function getEnv(key: string) {
  return process.env[key] || "";
}

const llm = new ChatOpenAI({
  model: getEnv("MODEL"),
  apiKey: getEnv("API_KEY"),
  configuration: {
    baseURL: getEnv("BASE_URL"),
  },
});

async function invoke() {
  const vectorstore = await embeddingDocument();
  const vector = await embeddings.embedQuery("再见");
  console.log("🚀 ~ invoke ~ vector:", vector);
  const vectorRes = await vectorstore.similaritySearchVectorWithScore(
    vector,
    3,
  );
  console.log("🚀 ~ invoke ~ vectorRes:", vectorRes);

  const res = await llm.invoke(
    "帮我看看对应的字幕相关内容描述文本结尾部分" + (vectorRes[0]?.[0]?.pageContent ?? ""),
  );

  console.log(res.content);

  return res;
}

invoke();
