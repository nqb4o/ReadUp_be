const Vocabulary = require("../models/Vocabulary");

class VocabularyController {
    // Thêm từ vựng
    addWord = async (req, res) => {
        try {
            const { user_id, word, article_id } = req.body;

            if (!user_id || !word || !article_id) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const newWord = await Vocabulary.createVocabulary({ user_id, word, article_id });
            res.status(201).json({ message: "Word added successfully", data: newWord });
        } catch (error) {
            console.error("Error adding word:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Lấy danh sách từ vựng của người dùng
    getWords = async (req, res) => {
        try {
            const { user_id } = req.params;

            if (!user_id) {
                return res.status(400).json({ error: "User ID is required" });
            }

            const words = await Vocabulary.findByUserId(user_id);
            res.status(200).json({ data: words });
        } catch (error) {
            console.error("Error fetching words:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Xóa từ vựng
    deleteWord = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ error: "Word ID is required" });
            }

            const deleted = await Vocabulary.deleteVocabulary(id);

            if (deleted) {
                res.status(200).json({ message: "Word deleted successfully" });
            } else {
                res.status(404).json({ error: "Word not found" });
            }
        } catch (error) {
            console.error("Error deleting word:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };
}

module.exports = new VocabularyController();