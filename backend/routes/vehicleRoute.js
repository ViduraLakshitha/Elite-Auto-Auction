import express from "express";
import { addVehicle, verifyVehicle } from "../controllers/vehicleController.js";
import { upload } from "../middleware/upload.js";  // Import the upload middleware from upload.js

const router = express.Router();

// Routes
router.post(
  "/add",
  upload.fields([
    { name: "images", maxCount: 10 },  // Accept up to 10 images
    { name: "documents", maxCount: 5 } // Accept up to 5 documents
  ]),
  addVehicle
);

router.patch("/verify/:vehicleId", verifyVehicle);

export default router;
