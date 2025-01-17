const db = require("../config/db");
const { v4: uuidv4 } = require('uuid');

class Book {
    static async findAll() {
        const result = await db.query('SELECT * FROM books ORDER BY title');
        return result[0];
    }

    static async findById(id) {
        const [rows] = await db.execute("SELECT * FROM books WHERE book_id = ?", [id]);
        return rows[0];
    };

    static async createBook(bookData) {
        const { title, author_last_name, author_first_name, rating } = bookData;
        const book_id = uuidv4();

        await db.query(
            `INSERT INTO books (book_id, title, author_last_name, author_first_name, rating)
             VALUES (?, ?, ?, ?, ?)`,
            [book_id, title, author_last_name, author_first_name, rating]
        );

        const [result] = await db.query(
            `SELECT * FROM books WHERE book_id = ?`,
            [book_id]
        );
        return result[0];
    }

    static async updateBook(bookId, bookData) {
        const { title, author_last_name, author_first_name, rating } = bookData;

        const result = await db.query(
            `UPDATE books 
             SET title = ?, 
                 author_last_name = ?, 
                 author_first_name = ?, 
                 rating = ?
             WHERE book_id = ?`,
            [title, author_last_name, author_first_name, rating, bookId]
        );
        return result;
    }

    static async deleteBook(bookId) {
        const result = await db.query(
            'DELETE FROM books WHERE book_id = ?',
            [bookId]
        );
        return result;
    }
}

module.exports = Book;
