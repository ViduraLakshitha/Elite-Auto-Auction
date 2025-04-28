import express from "express";
import { mongoDBURL, PORT } from "./config.js";
import mongoose from "mongoose";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import bidRoute from "./routes/bidRoute.js";
import commentRoute from"./routes/commentRoute.js";
import cron from "node-cron";
import { updateAuctionStatuses } from "./controllers/auctionController.js"; 
import cors from 'cors';
import sellerScoreboardRoutes from './routes/sellerScoreboardRoutes.js';
import buyerScoreboardRoutes from './routes/buyerScoreboardRoutes.js';
import { Server } from "socket.io";
import http from "http";
import path from "path";

const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));

app.use('/admin', adminRoute);
app.use('/user', userRoute);
app.use('/vehicle', vehicleRoute);
app.use('/auction', auctionRoute);
app.use('/sellers', sellerScoreboardRoutes);
app.use('/buyers', buyerScoreboardRoutes);
app.use('/bid', bidRoute);
app.use('/comment',commentRoute);

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
