const { Cohere } = require("@langchain/cohere");
const { CohereEmbeddings } = require("@langchain/cohere");
const { FaissStore } = require("@langchain/community/vectorstores/faiss");
const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { RetrievalQAChain } = require("langchain/chains");
const { PromptTemplate } = require("@langchain/core/prompts");

class RAGChatbot {
  constructor(cohereApiKey) {
    this.cohereApiKey = cohereApiKey;
    this.vectorStore = null;
    this.chain = null;
    this.teacherPrompt = PromptTemplate.fromTemplate(
      `You are a helpful teacher analyzing a student's document. Answer clearly and pedagogically.
      
      Context: {context}
      
      Student Question: {question}
      
      Teacher's Answer:`
    );
  }

  async initialize() {
    this.embeddings = new CohereEmbeddings({
      apiKey: this.cohereApiKey,
      model: "embed-english-v3.0",
    });
    this.llm = new Cohere({
      apiKey: this.cohereApiKey,
      model: "command",
      temperature: 0.7,
    });
  }

  async loadDocuments(filePath) {
    const loader = new PDFLoader(filePath);
    const rawDocs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await textSplitter.splitDocuments(rawDocs);

    // Using FAISS instead of HNSWLib
    this.vectorStore = await FaissStore.fromDocuments(docs, this.embeddings);

    this.chain = RetrievalQAChain.fromLLM(this.llm, this.vectorStore.asRetriever(), {
      prompt: this.teacherPrompt,
      returnSourceDocuments: true,
    });
  }

  async query(question) {
    if (!this.chain) throw new Error("Load documents first");
    return await this.chain.call({ query: question });
  }

  async saveVectorStore(path) {
    if (!this.vectorStore) throw new Error("No vector store to save");
    await this.vectorStore.save(path);
  }

  async loadVectorStore(path) {
    this.vectorStore = await FaissStore.load(path, this.embeddings);
    this.chain = RetrievalQAChain.fromLLM(this.llm, this.vectorStore.asRetriever(), {
      prompt: this.teacherPrompt,
    });
  }

  async loadArticleContent(articleContent) {
    // Kiểm tra đầu vào
    if (!articleContent || typeof articleContent !== "string") {
      throw new Error("Invalid article content provided");
    }

    // Đảm bảo articleContent là string
    const content = articleContent.toString().trim();

    if (content.length === 0) {
      throw new Error("Empty article content provided");
    }

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    try {
      // Tạo document từ text đầu vào
      const docs = await textSplitter.splitText(content);

      // Chuyển đổi các chunk text thành documents với pageContent
      const documents = docs.map(text => ({
        pageContent: text,
        metadata: { source: "user-provided-content" }
      }));

      // Tạo vector store từ documents
      this.vectorStore = await FaissStore.fromDocuments(
        documents,
        this.embeddings
      );

      // Tạo retrieval chain
      this.chain = RetrievalQAChain.fromLLM(
        this.llm,
        this.vectorStore.asRetriever(),
        {
          prompt: this.teacherPrompt,
          returnSourceDocuments: true,
        }
      );

      return {
        success: true,
        chunkCount: documents.length
      };
    } catch (error) {
      console.error("Error processing article content:", error);
      throw new Error(`Failed to process content: ${error.message}`);
    }
  }
}

module.exports = RAGChatbot;