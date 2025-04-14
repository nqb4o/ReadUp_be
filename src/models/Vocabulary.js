const db = require("../config/db");
const { v4: uuidv4 } = require('uuid');

class Vocabulary {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM vocabularies ORDER BY created_at DESC');
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM vocabularies WHERE id = ?", [id]);
        return rows[0];
    }

    static async findByUserId(user_id) {
        const [rows] = await db.execute("SELECT * FROM vocabularies WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
        return rows;
    }

    static async createVocabulary(vocabData) {
        const { user_id, word, article_id } = vocabData;
        const id = uuidv4();
        const created_at = new Date();

        await db.query(
            `INSERT INTO vocabularies (id, user_id, word, article_id, created_at)
             VALUES (?, ?, ?, ?, ?)`,
            [id, user_id, word, article_id, created_at]
        );

        const [result] = await db.query(
            `SELECT * FROM vocabularies WHERE id = ?`,
            [id]
        );
        return result[0];
    }

    static async updateVocabulary(id, vocabData) {
        const { word, article_id } = vocabData;

        const [result] = await db.query(
            `UPDATE vocabularies 
             SET word = ?, 
                 article_id = ?
             WHERE id = ?`,
            [word, article_id, id]
        );

        if (result.affectedRows === 0) {
            return null;
        }

        const [updatedVocab] = await db.query(
            `SELECT * FROM vocabularies WHERE id = ?`,
            [id]
        );

        return updatedVocab[0];
    }

    static async deleteVocabulary(id) {
        const [result] = await db.query(
            'DELETE FROM vocabularies WHERE id = ?',
            [id]
        );
        return result;
    }
}

module.exports = Vocabulary;
