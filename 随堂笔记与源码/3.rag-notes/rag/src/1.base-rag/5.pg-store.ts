import { Document } from "@langchain/core/documents";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import type { DistanceStrategy } from "@langchain/community/vectorstores/pgvector";
import type { PoolConfig } from "pg";

import { splitText } from "./2.split.ts";
import { embeddings } from "./3.embedding.ts";

/**
 * 第四步（方案二）：PGVector 持久化存储
 * 向量落到 PostgreSQL 里（需要先装 pgvector 扩展，见 docker/pg-start.sh），重启不丢，适合真实项目
 */
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
  // 支持的距离策略：cosine（默认）、innerProduct、euclidean
  distanceStrategy: "cosine" as DistanceStrategy,
};

/** 建表 + 写入向量 */
export const createPGVectorStore = async () => {
  const texts = await splitText();

  const vectorstore = await PGVectorStore.initialize(embeddings, config);

  await vectorstore.addDocuments(
    texts.map((text, index) => new Document({ pageContent: text, id: `${index}` })),
  );

  return vectorstore;
};

/** 查询向量同样要走 embedding，再拿向量去库里比距离 */
export const searchPGVectorStore = async (query: string, k = 3) => {
  const vectorstore = await createPGVectorStore();

  const vector = await embeddings.embedQuery(query);
  console.log("🚀 ~ searchPGVectorStore ~ vector:", vector);

  const results = await vectorstore.similaritySearchVectorWithScore(vector, k);
  console.log("🚀 ~ searchPGVectorStore ~ results:", results);

  return results;
};

// 直接运行本文件时执行：node src/1.base-rag/5.pg-store.ts
if (process.argv[1] === import.meta.filename) {
  await searchPGVectorStore("再见");
}
