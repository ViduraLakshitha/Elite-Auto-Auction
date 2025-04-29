import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import path from "path";
import cron from "node-cron";
import { Server } from "socket.io";

import { mongoDBURL, PORT } from "./config.js";

import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import bidRoute from "./routes/bidRoute.js";
import sellerScoreboardRoutes from "./routes/sellerScoreboardRoutes.js";
import buyerScoreboardRoutes from "./routes/buyerScoreboardRoutes.js";
import notificationRoute from "./routes/notificationRoutes.js"; 

import { updateAuctionStatuses } from "./controllers/auctionController.js";
import { Auction } from "./model/auction.js"; // 🆕 Import your Auction model

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Make io available globally
app.set('io', io);

app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

// All API routes
app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/vehicle', vehicleRoute);
app.use('/auction', auctionRoute);
app.use('/bid', bidRoute);
app.use('/sellers', sellerScoreboardRoutes);
app.use('/buyers', buyerScoreboardRoutes);
app.use('/notifications', notificationRoute); // 🆕 Notifications API

// 🛠 Function to reset notifiedLive on server start
async function resetNotifiedFlags() {
    try {
        const result = await Auction.updateMany(
            { notifiedLive: true },
            { $set: { notifiedLive: false } }
        );
        console.log(`🔄 Reset notifiedLive for ${result.modifiedCount} auctions at server start!`);
    } catch (error) {
        console.error('❌ Failed to reset notifiedLive flags:', error);
    }
}

// MongoDB connection
mongoose
    .connect(mongoDBURL)
    .then(async () => {
        console.log("✅ App connected to database");

        // 🛠 Reset notifications once after DB is connected
        await resetNotifiedFlags();

        // Cron job: Update auction statuses every second
        cron.schedule("* * * * * *", async () => {
            await updateAuctionStatuses();
        });
    })
    .catch((error) => {
        console.error("❌ Database connection error:", error);
    });

// Socket.IO Connection
io.on("connection", (socket) => {
    console.log("🔌 A user connected:", socket?.id);

    socket.on("disconnect", () => {
        console.log("🔌 A user disconnected");
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});

export { io };
