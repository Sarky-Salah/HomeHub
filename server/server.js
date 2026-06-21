// server/server.js

require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/AdminRoutes");

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

const onlineUsers = new Map();

// SOCKET
io.on("connection", (socket) => {

    console.log("NEW CONNECTION:", socket.id);

    socket.on("user-online", (userId) => {
        console.log("🔥 RECEIVED USER ONLINE EVENT:", userId);
    
        if (!userId) {
            console.log("❌ EMPTY USER ID");
            return;
        }
    
        onlineUsers.set(userId, socket.id);
    
        console.log("MAP:", [...onlineUsers.keys()]);
        console.log("COUNT:", onlineUsers.size);
    });

    socket.on("disconnect", () => {
        for (let [userId, socketId] of onlineUsers) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log("DSICONNECTED:", socket.id);
    });
});

// expose online count API
app.get("/api/admin/online-count", (req, res) => {
    res.json({
        success: true,
        onlineUsers: onlineUsers.size
    });
});

// routes
app.use("/api/admin", adminRoutes);

async function start() {
    await connectDB();
    server.listen(5000, () => {
        console.log("Server running on 5000");
    });
}

start();