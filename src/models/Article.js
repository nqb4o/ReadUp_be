const db = require("../config/db");
const { v4: uuidv4 } = require('uuid');

class Article {
    static async findAll() {
        const result = await db.query('SELECT * FROM articles ORDER BY title');
        return result[0];
    }

    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM articles WHERE id = ?", [id]);
        return rows[0];
    };

    static async createArticle(articleData) {
        const { title, content } = articleData;
        const id = uuidv4();

        await db.query(
            `INSERT INTO articles (id, title, content)
             VALUES (?, ?, ?)`,
            [id, title, content]
        );

        const [result] = await db.query(
            `SELECT * FROM articles WHERE id = ?`,
            [id]
        );
        return result[0];
    }

    static async updateArticle(id, articleData) {
        const { title, content } = articleData;

        const result = await db.query(
            `UPDATE articles 
             SET title = ?, 
                 content = ? 
             WHERE id = ?`,
            [title, content, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        // Fetch and return the updated article
        const [updatedArticle] = await db.query(
            `SELECT id, title, content
             FROM articles
             WHERE id = ?`,
            [id]
        );

        return updatedArticle[0];
    }

    static async deleteArticle(id) {
        const result = await db.query(
            'DELETE FROM articles WHERE id = ?',
            [id]
        );
        return result;
    }
}

module.exports = Article;
