import mongoose from "mongoose";
import { mongoDBURL } from "../config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
        process.exit(1);
    }
};
