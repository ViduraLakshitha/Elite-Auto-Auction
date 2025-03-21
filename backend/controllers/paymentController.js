import { Payment } from "../model/payment.js";
import { User } from "../model/userModel.js";

// Create a new payment
export const createPayment = async (req, res) => {
  const { userId, amount, paymentMethod } = req.body;

  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Generate a unique transaction ID
    const transactionId = `TXN_${Date.now()}`;

    // Create a new payment
    const newPayment = new Payment({
      userId,
      transactionId,
      amount,
      paymentMethod,
      paymentStatus: "pending", // Default status
    });

    // Save the payment to the database
    await newPayment.save();

    // Simulate payment processing (replace with actual payment gateway integration)
    setTimeout(async () => {
      newPayment.paymentStatus = "completed"; // Simulate successful payment
      await newPayment.save();
    }, 2000); // Simulate a 2-second delay

    res.status(201).json(newPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Failed to create payment", error: error.message });
  }
};

// Fetch payment history for a user
export const getPaymentHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch payments for the user
    const payments = await Payment.find({ userId });

    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment history:", error);
    res.status(500).json({ message: "Failed to fetch payment history", error: error.message });
  }
};

// Update payment status (e.g., mark as refunded or failed)
export const updatePaymentStatus = async (req, res) => {
  const { userId } = req.params;
  const { paymentStatus } = req.body;

  try {
    // Validate payment status
    const validStatuses = ["pending", "completed", "failed", "refunded"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    // Find the payment
    const payment = await Payment.findById(userId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment status
    payment.paymentStatus = paymentStatus;
    await payment.save();

    res.status(200).json(payment);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Failed to update payment status", error: error.message });
  }
};