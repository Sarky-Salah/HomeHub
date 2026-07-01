// server/server.js

require("./config/env");

const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const app = require("./app");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/AdminRoutes");

console.log("AUTH ROUTES LOADED");

const server = http.createServer(app);

// test route
app.get("/", (req, res) => {
    res.json({ success: true, message: "HomeHub API Running" });
});

// SOCKET.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("NEW CONNECTION:", socket.id);

    socket.on("user-online", (userId) => {
        if (!userId) return;

        onlineUsers.set(userId, socket.id);

        console.log("ONLINE USERS:", [...onlineUsers.keys()]);
    });

    socket.on("disconnect", () => {
        for (let [userId, socketId] of onlineUsers) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log("DISCONNECTED:", socket.id);
    });
});

// ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// ONLINE COUNT API
app.get("/api/admin/online-count", (req, res) => {
    res.json({
        success: true,
        onlineUsers: onlineUsers.size
    });
});

// START SERVER
async function start() {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (err) {
        console.error("SERVER START ERROR:", err);
    }
}

start();