const express = require('express');
require("dotenv").config();
const { parseJson, handleCors } = require("./src/middleware/index");

const app = express();

// Sử dụng middleware
app.use(handleCors);
app.use(parseJson);

const authRoutes = require('./src/routes/authRoutes');
app.use("/api/auth", authRoutes);

const bookRoutes = require('./src/routes/bookRoutes')
app.use('/api/book', bookRoutes)

const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})