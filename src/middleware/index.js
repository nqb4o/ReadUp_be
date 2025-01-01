const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Middleware xử lý JSON
const parseJson = express.json();

// Middleware xử lý CORS
const handleCors = cors({
    origin: process.env.FRONTEND_URL, // URL frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
});

module.exports = {
    parseJson,
    handleCors,
};