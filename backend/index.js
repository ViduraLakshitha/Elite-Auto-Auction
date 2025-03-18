import express from "express";
import { mongoDBURL, PORT } from "./config.js";
import mongoose from "mongoose";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import sellerScoreboardRoutes from './routes/sellerScoreboardRoutes.js';
import buyerScoreboardRoutes from './routes/buyerScoreboardRoutes.js';
import cors from "cors";

const app = express();

//Middleware
app.use(express.json());

//app.use(cors())

app.use("/api/admin", adminRoute);
app.use("/api/users", userRoute);
app.use('/api/sellers', sellerScoreboardRoutes);
app.use('/api/buyers', buyerScoreboardRoutes);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

