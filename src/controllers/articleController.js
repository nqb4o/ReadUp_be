const Article = require("../models/Article")

exports.getAllArticles = async (req, res) => {
    try {
        const articles = await Article.findAll();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createArticle = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Lấy đường dẫn ảnh

        if (!title || !content) {
            return res.status(400).json({
                message: 'Missing information',
            });
        }

        const newArticle = await Article.createArticle({ title, content, image, tags: JSON.parse(tags || '[]') });
        res.status(201).json(newArticle);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                message: 'This article already exists',
            });
        }
        res.status(500).json({ error: error.message });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, tags } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null; // Lấy đường dẫn ảnh

        if (!title || !content) {
            return res.status(400).json({
                message: 'Missing information',
            });
        }

        const updatedArticle = await Article.updateArticle(id, { title, content, image, tags: JSON.parse(tags || '[]') });

        if (!updatedArticle) {
            return res.status(404).json({
                message: 'Article not found',
            });
        }

        res.status(200).json(updatedArticle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const deletedArticle = await Article.deleteArticle(req.params.id);
        if (!deletedArticle) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}