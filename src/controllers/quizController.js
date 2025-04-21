const Quiz = require("../models/Quiz");
const db = require("../config/db");

class QuizController {
    // Lấy 10 câu hỏi ngẫu nhiên
    getRandomQuestions = async (req, res) => {
        try {
            const questions = await Quiz.getRandomQuestions();
            res.status(200).json({ questions });
        } catch (error) {
            console.error("Error fetching random questions:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Lưu kết quả bài quiz
    submitQuiz = async (req, res) => {
        const { user_id, answers } = req.body;

        if (!user_id || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ error: "Invalid request data" });
        }

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Tính toán kết quả
            const totalQuestions = answers.length;
            let correctAnswers = 0;

            for (const answer of answers) {
                const question = await Quiz.getQuestionById(answer.question_id);

                if (question?.correct_answer === answer.selected_answer) {
                    correctAnswers++;
                }
            }

            // Lưu thông tin bài quiz
            const attemptId = await Quiz.createQuizAttempt(user_id, totalQuestions, correctAnswers);

            // Lưu chi tiết từng câu hỏi
            for (const answer of answers) {
                // Lấy đáp án đúng từ DB để xác định đúng/sai
                const question = await Quiz.getQuestionById(answer.question_id);
                const isCorrect = answer.selected_answer === question.correct_answer;
                await Quiz.saveQuizAttemptQuestion(attemptId, answer.question_id, answer.selected_answer, isCorrect);
            }

            await connection.commit();

            res.status(201).json({
                message: "Quiz submitted successfully",
                attempt: {
                    attempt_id: attemptId,
                    total_questions: totalQuestions,
                    correct_answers: correctAnswers,
                },
            });
        } catch (error) {
            await connection.rollback();
            console.error("Error submitting quiz:", error);
            res.status(500).json({ error: "Internal server error" });
        } finally {
            connection.release();
        }
    };

    // Lấy lịch sử bài quiz của người dùng
    getQuizHistory = async (req, res) => {
        const { user_id } = req.params;

        try {
            const history = await Quiz.getQuizHistory(user_id);

            if (history.length === 0) {
                return res.status(404).json({ message: "No quiz history found for this user." });
            }

            res.status(200).json({ history });
        } catch (error) {
            console.error("Error fetching quiz history:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Lấy chi tiết bài quiz
    getQuizAttemptDetails = async (req, res) => {
        const { attempt_id } = req.params;

        try {
            const details = await Quiz.getQuizAttemptDetails(attempt_id);

            if (!details.attempt) {
                return res.status(404).json({ message: "Quiz attempt not found." });
            }

            res.status(200).json(details);
        } catch (error) {
            console.error("Error fetching quiz attempt details:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Thêm câu hỏi quiz mới
    createQuizQuestion = async (req, res) => {
        try {
            const { question, correct_answer, wrong1, wrong2, wrong3 } = req.body;
            if (!question || !correct_answer || !wrong1 || !wrong2 || !wrong3) {
                return res.status(400).json({ error: "Missing required fields" });
            }
            const [result] = await Quiz.createQuizQuestion({ question, correct_answer, wrong1, wrong2, wrong3 });
            res.status(201).json({ id: result.insertId, message: "Quiz question created" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Sửa câu hỏi quiz
    updateQuizQuestion = async (req, res) => {
        try {
            const { id } = req.params;
            const { question, correct_answer, wrong1, wrong2, wrong3 } = req.body;
            const [result] = await Quiz.updateQuizQuestion(id, { question, correct_answer, wrong1, wrong2, wrong3 });
            if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
            res.json({ message: "Quiz question updated" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Xóa câu hỏi quiz
    deleteQuizQuestion = async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await Quiz.deleteQuizQuestion(id);
            if (result.affectedRows === 0) return res.status(404).json({ error: "Not found" });
            res.json({ message: "Quiz question deleted" });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };

    // Lấy tất cả câu hỏi quiz (cho admin)
    getAllQuizQuestions = async (req, res) => {
        try {
            const questions = await Quiz.getAllQuizQuestions();
            res.json(questions);
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    };
}

module.exports = new QuizController();