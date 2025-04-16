const express = require('express');
require("dotenv").config();
const { parseJson, handleCors } = require("./src/middleware/index");
const path = require('path');
const fs = require('fs');

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Sử dụng middleware
app.use(handleCors);
app.use(parseJson);

const authRoutes = require('./src/routes/authRoutes');
app.use("/api/auth", authRoutes);

const articleRoutes = require('./src/routes/articleRoutes');
app.use('/api/article', articleRoutes);

// Add chatbot routes
const chatbotRoutes = require('./src/routes/chatbotRoutes');
app.use('/api/chatbot', chatbotRoutes);

const vocabularyRoutes = require("./src/routes/VocabularyRoutes");
app.use('/api/vocabulary', vocabularyRoutes);

const userRoutes = require("./src/routes/userRoutes");
app.use("/api/users", userRoutes);

const quizRoutes = require("./src/routes/quizRoutes");
app.use("/api/quiz", quizRoutes);

const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
app.listen(port, hostname, () => {
  console.log(`Server listening on port ${port}`);
});