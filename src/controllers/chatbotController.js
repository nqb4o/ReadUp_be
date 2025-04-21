const RAGChatbot = require("../services/ragChatbot");
const path = require("path");

class ChatbotController {
  constructor() {
    this.chatbot = new RAGChatbot(process.env.COHERE_API_KEY);
    this.initialized = false;

    // Initialize the chatbot when the controller is created
    this.initializeChatbot();
  }

  // Arrow function ensures 'this' is bound to the class instance
  initializeWithArticle = async (req, res) => {
    if (!this.initialized) {
      return res.status(503).json({ error: "Chatbot is not ready yet" });
    }

    try {
      const { articleTitle, articleContent } = req.body;

      if (!articleTitle || !articleContent) {
        return res.status(400).json({ error: "Article title and content are required" });
      }


      await this.chatbot.loadArticleContent(articleContent);

      console.log(`Chatbot initialized with article: ${articleTitle}`);
      res.json({ message: "Chatbot initialized with article content" });
    } catch (error) {
      console.error("Error initializing chatbot with article:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // Arrow function ensures 'this' is bound to the class instance
  initializeChatbot = async () => {
    try {
      await this.chatbot.initialize();
      this.initialized = true;
      console.log("Chatbot initialized successfully");
    } catch (error) {
      console.error("Failed to initialize chatbot:", error);
    }
  };

  // Arrow function ensures 'this' is bound to the class instance
  processQuery = async (req, res) => {
    if (!this.initialized) {
      return res.status(503).json({ error: "Chatbot is not ready yet" });
    }

    try {
      const { question } = req.body;

      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const response = await this.chatbot.query(question);
      res.json({
        answer: response.text,
        sources: response.sourceDocuments?.map(doc => ({
          content: doc.pageContent.substring(0, 200) + "...",
          metadata: doc.metadata,
        })),
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  // Arrow function ensures 'this' is bound to the class instance
  uploadDocument = async (req, res) => {
    if (!this.initialized) {
      return res.status(503).json({ error: "Chatbot is not ready yet" });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const filePath = path.join(__dirname, "../../uploads", req.file.filename);
      await this.chatbot.loadDocuments(filePath);

      // Optionally save the vector store for future use
      await this.chatbot.saveVectorStore("faiss_store");

      res.json({ message: "Document processed successfully" });
    } catch (error) {
      console.error("Document processing error:", error);
      res.status(500).json({ error: error.message });
    }
  };
}

// Export a singleton instance
module.exports = new ChatbotController();