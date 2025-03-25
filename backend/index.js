import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cron from "node-cron";
import cookieParser from "cookie-parser";
import mongoose from "mongoose"; // ✅ Import mongoose
import { mongoDBURL, PORT } from "./config.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import sellerScoreboardRoutes from './routes/sellerScoreboardRoutes.js';
import buyerScoreboardRoutes from './routes/buyerScoreboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js"; // ✅ Import adminRoute
import { updateAuctionStatuses, updateRemainingTime } from "./controllers/auctionController.js";

dotenv.config();

const app = express();

// ✅ Middleware (Placed before routes)
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ✅ Connect to MongoDB (Use only ONE connection)
connectDB();

// ✅ Routes (Ensure correct pathing)
app.use('/admin', adminRoute);
app.use('/user', userRoute);
// app.use('/vehicle', vehicleRoute);
app.use('/auction', auctionRoute);
app.use('/sellers', sellerScoreboardRoutes);
app.use('/buyers', buyerScoreboardRoutes);
app.use('/payments', paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoute);

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ✅ Ensure only ONE database connection
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

// ✅ Handle MongoDB Connection Errors
mongoose.connection.on("error", (error) => {
  console.error("Database connection error:", error);
});
