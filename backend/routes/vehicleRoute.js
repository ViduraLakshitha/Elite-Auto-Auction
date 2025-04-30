import express from "express";
import { addVehicle, verifyVehicle, getAllVehicles } from "../controllers/vehicleController.js";
import { upload } from "../middleware/upload.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { Vehicle } from "../model/vehicle.js";

const router = express.Router();

// Add vehicle with image & document uploads
router.post(
  "/add",
  authenticate,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "documents", maxCount: 5 }
  ]),
  addVehicle
);

// Verify a vehicle
router.patch("/verify/:vehicleId", authenticate, verifyVehicle);

// Get all vehicles
router.get("/vehicle-details", getAllVehicles);

// DELETE a vehicle by ID
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Server error during deletion" });
  }
});

export default router;
