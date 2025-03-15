import express from "express";
import {mongoDBURL, PORT} from "./config.js";
import mongoose from "mongoose";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import cors from 'cors';

const app = express();

app.use(express.json());

//app.use(cors())

app.use('/admin',adminRoute);
app.use('/user', userRoute);
app.use('/vehicle', vehicleRoute);
app.use('/auction', auctionRoute);

mongoose
    .connect(mongoDBURL)
    .then(()=>{
        console.log("App connected to databaase");
        
        app.listen(PORT,()=>{
            console.log(`app is listening on port ${PORT}`);
            
        })
    })
    .catch((error)=>{
        console.log(error);
        
    })
