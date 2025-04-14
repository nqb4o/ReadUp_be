const express = require("express");
const router = express.Router();
const vocabularyController = require("../controllers/VocabularyController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Thêm từ vựng
router.post("/add", authMiddleware, vocabularyController.addWord);

// Lấy danh sách từ vựng của người dùng
router.get("/:user_id", authMiddleware, vocabularyController.getWords);

// Xóa từ vựng
router.delete("/:id", authMiddleware, vocabularyController.deleteWord);

module.exports = router;