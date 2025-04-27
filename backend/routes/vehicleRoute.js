import express from "express";
import { addVehicle, verifyVehicle } from "../controllers/vehicleController.js";
import { upload } from "../middleware/upload.js";
// import { Vehicle } from "../models/vehicleModel.js"; // 
import { Vehicle } from "../model/vehicle.js"; // 
//===================================================
import { getAllVehicles } from "../controllers/vehicleController.js";


const router = express.Router();

// Add vehicle with image & document uploads
router.post(
  "/add",
  upload.fields([
    { name: "images", maxCount: 10 }, // Accept up to 10 images
    { name: "documents", maxCount: 5 } // Accept up to 5 documents
  ]),
  addVehicle
);




router.patch("/verify/:vehicleId", verifyVehicle);
//====================================
router.get('/vehicle-details', getAllVehicles);

export default router;