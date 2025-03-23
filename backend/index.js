import express from "express";
import { mongoDBURL, PORT } from "./config.js";
import mongoose from "mongoose";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import cron from "node-cron";
import { updateAuctionStatuses, updateRemainingTime } from "./controllers/auctionController.js";
import cors from 'cors';
import sellerScoreboardRoutes from './routes/sellerScoreboardRoutes.js';
import buyerScoreboardRoutes from './routes/buyerScoreboardRoutes.js';

// import { Server } from "socket.io";
// import http from "http";
// //test

const app = express();

//Middleware
app.use(express.json());

app.use(cors())

app.use('/admin',adminRoute);
app.use('/user', userRoute);
app.use('/vehicle', vehicleRoute);
app.use('/auction', auctionRoute);
app.use('/sellers', sellerScoreboardRoutes);
app.use('/buyers', buyerScoreboardRoutes);

mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log("App connected to databaase");
        
        app.listen(PORT,()=>{
            console.log(`app is listening on port ${PORT}`);
            
        })

        // Schedule status updates every minute
        cron.schedule("*/1 * * * *", async () => {
            console.log("Running auction status update task...");
            await updateAuctionStatuses();
        });

        updateRemainingTime();
        setInterval(updateRemainingTime, 60000);  //call function every minute
    })
    .catch((error)=>{
        console.log(error);
        
    })
