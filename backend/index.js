import express from "express";
import {mongoDBURL, PORT} from "./config.js";
import mongoose from "mongoose";
import adminRoute from "./routes/adminRoute.js"
import cors from 'cors';

const app = express();

app.use(express.json());

//app.use(cors())

app.use('/admin',adminRoute);

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
