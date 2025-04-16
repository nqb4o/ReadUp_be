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
        const { title, content, image, tags } = articleData;
        const id = uuidv4();

        // Thêm bài báo
        await db.query(
            `INSERT INTO articles (id, title, content, image)
             VALUES (?, ?, ?, ?)`,
            [id, title, content, image]
        );

        // Xử lý tags
        if (tags && tags.length > 0) {
            await this.addTagsToArticle(id, tags);
        }

        const [result] = await db.query(
            `SELECT * FROM articles WHERE id = ?`,
            [id]
        );
        return result[0];
    }

    static async updateArticle(id, articleData) {
        const { title, content, image, tags } = articleData;

        const result = await db.query(
            `UPDATE articles 
             SET title = ?, 
                 content = ?, 
                 image = COALESCE(?, image) 
             WHERE id = ?`,
            [title, content, image, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        // Xử lý tags
        if (tags && tags.length > 0) {
            await this.updateTagsForArticle(id, tags);
        }

        const [updatedArticle] = await db.query(
            `SELECT id, title, content, image
             FROM articles
             WHERE id = ?`,
            [id]
        );

        return updatedArticle[0];
    }

    static async addTagsToArticle(articleId, tags) {
        for (const tag of tags) {
            // Thêm tag vào bảng tags nếu chưa tồn tại
            const [tagResult] = await db.query(
                `INSERT IGNORE INTO tags (name) VALUES (?)`,
                [tag]
            );

            // Lấy ID của tag vừa thêm hoặc đã tồn tại
            const [tagRow] = await db.query(
                `SELECT id FROM tags WHERE name = ?`,
                [tag]
            );

            const tagId = tagRow.id;

            // Liên kết bài báo với tag
            await db.query(
                `INSERT IGNORE INTO article_tags (article_id, tag_id)
                 VALUES (?, ?)`,
                [articleId, tagId]
            );
        }
    }

    static async updateTagsForArticle(articleId, tags) {
        // Xóa tất cả các liên kết tags cũ
        await db.query(
            `DELETE FROM article_tags WHERE article_id = ?`,
            [articleId]
        );

        // Thêm lại các tags mới
        await this.addTagsToArticle(articleId, tags);
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
