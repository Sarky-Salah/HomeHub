// server/app.js
const express = require("express");
const app = express();

const protect = require("./middleware/middleware");
const User = require("./models/User");
const cors = require("cors");
const propertyRoutes = require("./routes/propertyRoutes");
const messageRoutes = require("./routes/messageRoutes");

console.log("AUTH ROUTES LOADED");

app.use(express.json());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/messages", messageRoutes);
app.use("/api/properties", propertyRoutes);
app.get("/", (req, res) => { res.json({ success: true, message: "HomeHub API Running" });});
app.put("/api/users/request-verification", protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);

        if (!user) return res.json({ success: false });

        user.verificationStatus = "pending";
        await user.save();

        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});
module.exports = app;