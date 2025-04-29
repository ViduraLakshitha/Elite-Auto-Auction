import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
      {
            userId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User", // Reference to the User collection
                  required: true,
            },

            transactionId: {
                  type: String,
                  required: true,
                  unique: true, // Ensures each transaction is unique
            },

            amount: {
                  type: Number,
                  required: true,
                  min: [0, "Amount cannot be negative"], // Prevents negative transactions
            },

            paymentStatus: {
                  type: String,
                  enum: ["pending", "completed", "failed", "refunded"], // Restricts valid statuses
                  default: "pending",
                  required: true,
            },

            paymentMethod: {
                  type: String,
                  enum: ["PayPal", "Stripe", "Credit Card", "Bank Transfer"],
                  required: true,
            },
      },
      { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
