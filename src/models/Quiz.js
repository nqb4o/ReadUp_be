const db = require("../config/db");

class Quiz {
    // Lấy 10 câu hỏi ngẫu nhiên
    static async getRandomQuestions() {
        const [questions] = await db.query(
            `SELECT id, vocabulary_id, correct_meaning, wrong1, wrong2, wrong3 
             FROM quiz_questions 
             ORDER BY RAND() 
             LIMIT 10`
        );
        return questions;
    }

    // Lấy thông tin câu hỏi theo ID
    static async getQuestionById(questionId) {
        const [question] = await db.query(
            `SELECT correct_meaning FROM quiz_questions WHERE id = ?`,
            [questionId]
        );
        return question[0];
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
            `SELECT qq.id AS question_id, qq.vocabulary_id, qq.correct_meaning, qaq.selected_answer, qaq.is_correct
             FROM quiz_attempt_questions qaq
             JOIN quiz_questions qq ON qaq.question_id = qq.id
             WHERE qaq.attempt_id = ?`,
            [attemptId]
        );

        return { attempt: attempt[0], questions };
    }
}

module.exports = Quiz;