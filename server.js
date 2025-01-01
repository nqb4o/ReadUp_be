const express = require('express');
require("dotenv").config();
const { parseJson, handleCors } = require("./src/middleware/index");

const app = express();

// Sử dụng middleware
app.use(parseJson);
app.use(handleCors);

const authRoutes = require('./src/routes/authRoutes');

app.use("/api/auth", authRoutes);

const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})