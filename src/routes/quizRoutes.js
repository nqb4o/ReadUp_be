const express = require("express");
const quizController = require("../controllers/quizController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Lấy 10 câu hỏi ngẫu nhiên
router.get("/questions", authMiddleware, quizController.getRandomQuestions);

// Nộp bài quiz
router.post("/submit", authMiddleware, quizController.submitQuiz);

// Lấy lịch sử bài quiz của người dùng
router.get("/history/:user_id", authMiddleware, quizController.getQuizHistory);

// Lấy chi tiết bài quiz
router.get("/attempt/:attempt_id", authMiddleware, quizController.getQuizAttemptDetails);

router.get("/", authMiddleware, adminMiddleware, quizController.getAllQuizQuestions); // Lấy tất cả câu hỏi

router.post("/", authMiddleware, adminMiddleware, quizController.createQuizQuestion); // Thêm mới

router.put("/:id", authMiddleware, adminMiddleware, quizController.updateQuizQuestion); // Sửa

router.delete("/:id", authMiddleware, adminMiddleware, quizController.deleteQuizQuestion); // Xóa

module.exports = router;