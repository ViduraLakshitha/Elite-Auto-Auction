import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
const PORT = 5555;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/vehicleAuctionDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/contact", contactRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
