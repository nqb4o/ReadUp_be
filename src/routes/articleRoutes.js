const express = require('express');
const { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle } = require("../controllers/articleController");
const { authMiddleware } = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware"); // Import middleware multer

const router = express.Router();

router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.post('/', authMiddleware, upload.single('image'), createArticle); // Thêm middleware upload
router.put('/:id', authMiddleware, upload.single('image'), updateArticle); // Thêm middleware upload
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;