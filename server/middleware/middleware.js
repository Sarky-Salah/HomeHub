// server/middleware/middleware.js

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;


        return next(); // ✅ ONLY ONCE

    } catch (err) {
        console.log("AUTH ERROR:", err.message);

        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = protect;