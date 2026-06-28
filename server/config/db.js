// server/config/db.js

const mongoose = require("mongoose");

const uri =
    process.env.USE_ATLAS === "true"
        ? process.env.MONGO_ATLAS
        : process.env.MONGO_LOCAL;

async function connectDB() {
    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;