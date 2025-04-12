const RAGChatbot = require("./ragChatbot");
const path = require("path");

const COHERE_API_KEY = "qe6IcvR8hY4cgjcUBBR45FXt3JP3eFBhwV9X0DKf";

async function testChatbot() {
  try {
    const chatbot = new RAGChatbot(COHERE_API_KEY);
    await chatbot.initialize();

    // 1. Test with fresh PDF processing
    console.log("Loading PDF...");
    await chatbot.loadDocuments(path.join(__dirname, "example.pdf"));
    await chatbot.saveVectorStore("faiss_store");
    
    // 2. Test querying
    const response = await chatbot.query("What is the main topic of this document?");
    console.log("Answer:", response.text);
    console.log("Sources:", response.sourceDocuments.map(d => d.pageContent.substring(0, 100) + "..."));

    // 3. Test loading saved store
    const newChatbot = new RAGChatbot(COHERE_API_KEY);
    await newChatbot.initialize();
    await newChatbot.loadVectorStore("faiss_store");
    console.log(await newChatbot.query("Summarize key concepts"));
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testChatbot();