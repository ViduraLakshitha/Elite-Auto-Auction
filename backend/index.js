import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import cron from "node-cron"; // ✅ keep only one instance
import { Server } from "socket.io";
import http from "http";

// Route imports
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import bidRoute from "./routes/bidRoute.js";
import commentRoute from "./routes/commentRoute.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import transportationRoute from "./routes/transportationRoute.js";
import contactRoutes from "./routes/contactRoutes.js";

// Config imports
import { mongoDBURL, PORT } from "./config.js";
import { connectDB } from "./config/db.js";
import { updateAuctionStatuses, updateRemainingTime } from "./controllers/auctionController.js";


// Load environment variables
dotenv.config();

// Initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// API Routes
app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/vehicle',vehicleRoute);
app.use('/auction', auctionRoute);
app.use('/bid', bidRoute);
app.use('/comment',commentRoute);
app.use('/payments', paymentRoutes);

app.use("/api", auctionRoute);

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoute);
app.use('/api/transportation', transportationRoute);
app.use('/api/contact', contactRoutes);

// Socket.io events
io.on("connection", (socket) => {
    console.log("A user connected", socket?.id);
//==================
    socket.on('joinUserRoom', (userId) => {
        console.log(`User joined room: ${userId}`);
        socket.join(userId); // join user-specific room
      });
//=======================added 28th april
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const newPort = PORT + 1;
        console.log(`Port ${PORT} is busy, trying port ${newPort}`);
        server.listen(newPort, () => {
            console.log(`Server running on port ${newPort}`);
        });
    } else {
        console.error('Server error:', err);
    }
});

// MongoDB Events
// mongoose.connect.once("open", () => {
//     console.log("Database connected successfully!");

//     // Cron Jobs
//     cron.schedule("*/1 * * * *", async () => {
//         console.log("Running auction status update task...");
//         await updateAuctionStatuses();
//     });

//     // Update remaining time every minute
//     updateRemainingTime();
//     setInterval(updateRemainingTime, 60000);
// });

mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log("app connected to the database");

        cron.schedule("* * * * * *", async () => {
            await updateAuctionStatuses();
        });

        updateRemainingTime();
    setInterval(updateRemainingTime, 60000);
        
    })
    .catch((error)=>{
        console.log(error);
        
    });

// Handle MongoDB Errors
mongoose.connection.on("error", (error) => {
    console.error("Database connection error:", error);
});

// Export io for real-time communication
export { io };
