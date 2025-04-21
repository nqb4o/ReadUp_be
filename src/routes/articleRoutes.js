const express = require('express');
const { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require("../controllers/articleController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.post('/', authMiddleware, createArticle); // Thêm middleware upload
router.put('/:id', authMiddleware, updateArticle); // Thêm middleware upload
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;