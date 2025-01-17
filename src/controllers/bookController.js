const Book = require("../models/Book")

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.createBook = async (req, res) => {
    try {
        const { title, author_last_name, author_first_name, rating } = req.body;

        if (!title || !author_last_name) {
            return res.status(400).json({
                message: 'Title and author last name are required'
            });
        }

        if (rating && (rating < 1 || rating > 10)) {
            return res.status(400).json({
                message: 'Rating must be between 1 and 10'
            });
        }

        const newBook = await Book.createBook(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                message: 'A book with this title and author last name already exists'
            });
        }
        res.status(500).json({ error: error.message });
    }
}

exports.updateBook = async (req, res) => {
    try {
        const { title, author_last_name, author_first_name, rating } = req.body;

        if (!title || !author_last_name) {
            return res.status(400).json({
                message: 'Title and author last name are required'
            });
        }

        if (rating && (rating < 1 || rating > 10)) {
            return res.status(400).json({
                message: 'Rating must be between 1 and 10'
            });
        }

        const updatedBook = await Book.updateBook(req.params.id, req.body);
        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book updated!' });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({
                message: 'A book with this title and author last name already exists'
            });
        }
        res.status(500).json({ error: error.message });
    }
}

exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.deleteBook(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}