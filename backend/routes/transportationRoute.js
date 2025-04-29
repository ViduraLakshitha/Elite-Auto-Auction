import express from "express";
import { 
  registerTransportation, 
  getTransportationByUser, 
  getAllTransportation, 
  verifyTransportation,
  updateTransportation,
  deleteTransportation
} from "../controllers/transportationController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register a transportation company
router.post("/register", authenticate, registerTransportation);

// Get transportation companies by logged in user
router.get("/my-companies", authenticate, getTransportationByUser);

// Get all transportation companies (admin)
router.get("/all", authenticate, getAllTransportation);

// Verify a transportation company (admin)
router.patch("/verify/:transportationId", authenticate, verifyTransportation);

// Update a transportation company
router.put("/:transportationId", authenticate, updateTransportation);

// Delete a transportation company
router.delete("/:transportationId", authenticate, deleteTransportation);

export default router; 