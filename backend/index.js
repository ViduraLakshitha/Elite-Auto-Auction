import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import mongoose from "mongoose"; // Import mongoose
import { mongoDBURL, PORT } from "./config.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import bidRoute from "./routes/bidRoute.js";
import cron from "node-cron";
import { updateAuctionStatuses } from "./controllers/auctionController.js"; 
import cors from 'cors';
import sellerScoreboardRoutes from './routes/sellerScoreboardRoutes.js';
import buyerScoreboardRoutes from './routes/buyerScoreboardRoutes.js';
import { Server } from "socket.io";
import http from "http";
import path from "path";
import paymentRoutes from './routes/paymentRoutes.js';
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js"; //  Import adminRoute
import { updateAuctionStatuses, updateRemainingTime } from "./controllers/auctionController.js";

dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB (Use only ONE connection)
connectDB();
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// Routes (Ensure correct pathing)
app.use('/admin', adminRoute);
app.use('/user', userRoute);
// app.use('/vehicle', vehicleRoute);
app.use('/auction', auctionRoute);
app.use('/sellers', sellerScoreboardRoutes);
app.use('/buyers', buyerScoreboardRoutes);
app.use('/bid', bidRoute);

mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log("App connected to database");

        // Schedule status updates every second
        cron.schedule("* * * * * *", async () => {
            await updateAuctionStatuses();
        });
    })
    .catch((error)=>{
        console.log(error);
    });

// Listen for new updates
io.on("connection", (socket) => {
    console.log("A user connected", socket?.id);

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});

export { io };
app.use('/payments', paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoute);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Ensure only ONE database connection
mongoose.connection.once("open", () => {
  console.log("Database connected successfully!");

  // Cron Jobs (Runs every minute)
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running auction status update task...");
    await updateAuctionStatuses();
  });

  updateRemainingTime();
  setInterval(updateRemainingTime, 60000);
});

// Handle MongoDB Connection Errors
mongoose.connection.on("error", (error) => {
  console.error("Database connection error:", error);
});
