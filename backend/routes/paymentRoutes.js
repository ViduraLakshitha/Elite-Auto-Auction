import express from "express";
import {
  createPayment,
  getPaymentHistory,
  updatePaymentStatus,
} from "../controllers/paymentController.js";

const router = express.Router();

// Create a new payment
router.post("/", createPayment);

// Fetch payment history for a user
router.get("/:userId", getPaymentHistory);

// Update payment status
router.put("/:userId", updatePaymentStatus);

export default router;