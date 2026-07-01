// server/config/db.js

const mongoose = require("mongoose");


const connectDB = async () => {

    try {

        const uri =
        process.env.USE_ATLAS === "true"
            ? process.env.MONGODB_ATLAS
            : process.env.MONGODB_LOCAL;

            console.log("MONGODB INSIDE DB FILE:", uri);

        if (!uri) {
            throw new Error("MongoDB URI is missing");
        }
        
        await mongoose.connect(uri);

        console.log("✅ MongoDB Connected");

    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;