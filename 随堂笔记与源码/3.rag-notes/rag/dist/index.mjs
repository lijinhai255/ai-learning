import "dotenv/config";
import path from "node:path";
import { SRTLoader } from "@langchain/community/document_loaders/fs/srt";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { Document } from "@langchain/core/documents";
// src/index.ts
const loader = new SRTLoader(path.resolve(import.meta.dirname, "../rga-document/sample.srt"));
console.log(process.env.BASE_URL);
const loadDocument = async () => {
	return await loader.load();
};
loadDocument();
const splitText = async () => {
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 50,
		chunkOverlap: 10
	});
	const doc = await loadDocument();
	const chunks = await splitter.splitText(doc[0]?.pageContent);
	console.log("🚀 ~ splitText ~ chunks:", chunks);
	return chunks;
};
splitText();
const embeddings = new OpenAIEmbeddings({
	model: getEnv("EMBEDDING_MODEL"),
	apiKey: getEnv("API_KEY"),
	configuration: { baseURL: getEnv("BASE_URL") }
});
const embeddingDocument = async () => {
	const texts = await splitText();
	await embeddings.embedDocuments(texts);
	const vectorstore = await PGVectorStore.initialize(embeddings, {
		postgresConnectionOptions: {
			type: "postgres",
			host: "127.0.0.1",
			port: 5432,
			user: "postgres",
			password: "heyi",
			database: "embedding"
		},
		tableName: "heyilangchainjs",
		columns: {
			idColumnName: "id",
			vectorColumnName: "vector",
			contentColumnName: "content",
			metadataColumnName: "metadata"
		},
		distanceStrategy: "cosine"
	});
	vectorstore.addDocuments(texts.map((text, index) => new Document({
		pageContent: text,
		id: `${index}`
	})));
	return vectorstore;
};
function getEnv(key) {
	return process.env[key] || "";
}
const llm = new ChatOpenAI({
	model: getEnv("MODEL"),
	apiKey: getEnv("API_KEY"),
	configuration: { baseURL: getEnv("BASE_URL") }
});
async function invoke() {
	const vectorstore = await embeddingDocument();
	const vector = await embeddings.embedQuery("再见");
	console.log("🚀 ~ invoke ~ vector:", vector);
	const vectorRes = await vectorstore.similaritySearchVectorWithScore(vector, 3);
	console.log("🚀 ~ invoke ~ vectorRes:", vectorRes);
	const res = await llm.invoke("帮我看看对应的字幕相关内容描述文本结尾部分" + (vectorRes[0]?.[0]?.pageContent ?? ""));
	console.log(res.content);
	return res;
}
invoke();
export { loadDocument };

//# sourceMappingURL=index.mjs.map