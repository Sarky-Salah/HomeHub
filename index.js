const express = require("express");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to HomeHub Backend");
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});