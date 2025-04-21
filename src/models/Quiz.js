const db = require("../config/db");

class Quiz {
    // Lấy 10 câu hỏi ngẫu nhiên
    static async getRandomQuestions() {
        const [questions] = await db.query(
            `SELECT id, question, correct_answer, wrong1, wrong2, wrong3 
             FROM quiz_questions 
             ORDER BY RAND() 
             LIMIT 10`
        );
        return questions;
    }

    // Lấy 1 câu hỏi theo id
    static async getQuestionById(questionId) {
        const [rows] = await db.query(
            `SELECT id, question, correct_answer, wrong1, wrong2, wrong3 
             FROM quiz_questions WHERE id = ?`,
            [questionId]
        );
        return rows[0];
    }

    // Lưu thông tin bài quiz
    static async createQuizAttempt(userId, totalQuestions, correctAnswers) {
        const [result] = await db.query(
            `INSERT INTO quiz_attempts (user_id, total_questions, correct_answers, started_at, ended_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [userId, totalQuestions, correctAnswers]
        );
        return result.insertId;
    }

    // Lưu chi tiết từng câu hỏi trong bài quiz
    static async saveQuizAttemptQuestion(attemptId, questionId, selectedAnswer, isCorrect) {
        await db.query(
            `INSERT INTO quiz_attempt_questions (attempt_id, question_id, selected_answer, is_correct)
             VALUES (?, ?, ?, ?)`,
            [attemptId, questionId, selectedAnswer, isCorrect]
        );
    }

    // Lấy lịch sử bài quiz của người dùng
    static async getQuizHistory(userId) {
        const [history] = await db.query(
            `SELECT id AS attempt_id, total_questions, correct_answers, started_at, ended_at
             FROM quiz_attempts
             WHERE user_id = ?
             ORDER BY started_at DESC`,
            [userId]
        );
        return history;
    }

    // Lấy chi tiết bài quiz
    static async getQuizAttemptDetails(attemptId) {
        const [attempt] = await db.query(
            `SELECT id AS attempt_id, user_id, total_questions, correct_answers, started_at, ended_at
             FROM quiz_attempts
             WHERE id = ?`,
            [attemptId]
        );

        const [questions] = await db.query(
            `SELECT qq.id AS question_id, qq.question, qq.correct_answer, qaq.selected_answer, qaq.is_correct
             FROM quiz_attempt_questions qaq
             JOIN quiz_questions qq ON qaq.question_id = qq.id
             WHERE qaq.attempt_id = ?`,
            [attemptId]
        );

        return { attempt: attempt[0], questions };
    }

    // Thêm câu hỏi quiz mới
    static async createQuizQuestion({ question, correct_answer, wrong1, wrong2, wrong3 }) {
        return db.query(
            `INSERT INTO quiz_questions (question, correct_answer, wrong1, wrong2, wrong3, created_at)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [question, correct_answer, wrong1, wrong2, wrong3]
        );
    }

    // Sửa câu hỏi quiz
    static async updateQuizQuestion(id, { question, correct_answer, wrong1, wrong2, wrong3 }) {
        return db.query(
            `UPDATE quiz_questions SET question=?, correct_answer=?, wrong1=?, wrong2=?, wrong3=?
             WHERE id=?`,
            [question, correct_answer, wrong1, wrong2, wrong3, id]
        );
    }

    // Xóa câu hỏi quiz
    static async deleteQuizQuestion(id) {
        return db.query(
            `DELETE FROM quiz_questions WHERE id=?`,
            [id]
        );
    }

    // Lấy tất cả câu hỏi quiz
    static async getAllQuizQuestions() {
        const [rows] = await db.query(`SELECT * FROM quiz_questions ORDER BY created_at DESC`);
        return rows;
    }
}

module.exports = Quiz;