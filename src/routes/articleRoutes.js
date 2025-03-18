const express = require('express');
const { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require("../controllers/articleController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.post('/', authMiddleware, createArticle);
router.put('/:id', authMiddleware, updateArticle);
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;