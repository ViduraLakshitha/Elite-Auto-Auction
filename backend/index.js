// import express from "express";
// import { mongoDBURL, PORT } from "./config.js";
// import mongoose from "mongoose";
// import adminRoute from "./routes/adminRoute.js";
// import userRoute from "./routes/userRoute.js";
// import vehicleRoute from "./routes/vehicleRoute.js";
// import auctionRoute from "./routes/auctionRoute.js";
// import bidRoute from "./routes/bidRoute.js";
// import cron from "node-cron";
// import { updateAuctionStatuses } from "./controllers/auctionController.js"; 
// import cors from 'cors';
// import sellerScoreboardRoutes from './routes/sellerScoreboardRoutes.js';
// import buyerScoreboardRoutes from './routes/buyerScoreboardRoutes.js';
// import { Server } from "socket.io";
// import http from "http";

// //import { Server } from "socket.io";
// //import http from "http";
// //test



// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// app.use(express.json());

// app.use(cors())

// app.use('/admin',adminRoute);
// app.use('/user', userRoute);
// app.use('/vehicle', vehicleRoute);
// app.use('/auction', auctionRoute);
// app.use('/sellers', sellerScoreboardRoutes);
// app.use('/buyers', buyerScoreboardRoutes);
// app.use('/bid', bidRoute);

// mongoose
//     .connect(mongoDBURL)
//     .then(()=>{
//         console.log("App connected to databaase");

//         // Schedule status updates every second
//         cron.schedule("* * * * * *", async () => {
//             //console.log("Running auction status update task...");
//             await updateAuctionStatuses();
//         });
//     })
//     .catch((error)=>{
//         console.log(error);
        
//     })


// // Listen for new updates
// io.on("connection", (socket) => {
//     console.log("A user connected", socket?.id);

//     socket.on("disconnect", () => {
//         console.log("A user disconnected");
//     });
// });

// server.listen(PORT,()=>{
//     console.log(`app is listening on port ${PORT}`);
    
// })

// cron.schedule("0 * * * *", async () => {
//     console.log("Running recommendation cleanup...");

//     const sevenDaysAgo = new Date();
//     sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

//     // Remove old interactions
//     await UserInteractions.deleteMany({ updatedAt: { $lt: sevenDaysAgo } });

//     console.log("Old interactions removed.");
// });

// export { io };



import express from "express";
import { mongoDBURL, PORT } from "./config.js";
import mongoose from "mongoose";
import adminRoute from "./routes/adminRoute.js";
import userRoute from "./routes/userRoute.js";
import vehicleRoute from "./routes/vehicleRoute.js";
import auctionRoute from "./routes/auctionRoute.js";
import bidRoute from "./routes/bidRoute.js";
import cron from "node-cron";
import { updateAuctionStatuses } from "./controllers/auctionController.js"; 
import cors from "cors";
import sellerScoreboardRoutes from "./routes/sellerScoreboardRoutes.js";
import buyerScoreboardRoutes from "./routes/buyerScoreboardRoutes.js";
import { Server } from "socket.io";
import http from "http";

// Create Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// Routes
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/vehicle", vehicleRoute);
app.use("/auction", auctionRoute);
app.use("/sellers", sellerScoreboardRoutes);
app.use("/buyers", buyerScoreboardRoutes);
app.use("/bid", bidRoute);

// 🆕 Contact Us Route
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    console.log("Received contact request:", { name, email, message });

    // You can save the message in a database or trigger an email here.

    res.status(200).json({ message: "Message received successfully!" });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// MongoDB Connection
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");

    // Schedule status updates every second
    cron.schedule("* * * * * *", async () => {
      await updateAuctionStatuses();
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Socket.io Events
io.on("connection", (socket) => {
  console.log("A user connected:", socket?.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});

// Cleanup Old Recommendations (Every Hour)
cron.schedule("0 * * * *", async () => {
  console.log("Running recommendation cleanup...");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Remove old interactions (Ensure `UserInteractions` is imported)
  await UserInteractions.deleteMany({ updatedAt: { $lt: sevenDaysAgo } });

  console.log("Old interactions removed.");
});

export { io };
