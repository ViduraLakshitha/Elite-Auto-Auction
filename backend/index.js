import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cron from "node-cron";
import { mongoDBURL, PORT } from "./config.js";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import sellerScoreboardRoutes from './routes/sellerScoreboardRoutes.js';
import buyerScoreboardRoutes from './routes/buyerScoreboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { updateAuctionStatuses, updateRemainingTime } from "./controllers/auctionController.js";


const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/vehicle', vehicleRoute);
app.use('/auction', auctionRoute);
app.use('/sellers', sellerScoreboardRoutes); 
app.use('/buyers', buyerScoreboardRoutes);
app.use('/payments', paymentRoutes);
app.use("/api", auctionRoute);




mongoose.connect(mongoDBURL)
  .then(() => {
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

    // Cron Jobs (Runs every minute)
    cron.schedule("*/1 * * * *", async () => {
      console.log("Running auction status update task...");
      await updateAuctionStatuses();
    });

    updateRemainingTime();
    setInterval(updateRemainingTime, 60000);
  })
  .catch((error) => {
    console.error(" Database connection error:", error);
  });
