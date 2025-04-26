import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
      {
            userId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User", // Reference to the User collection
                  required: true,
            },

            auctionId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Auction",
                  required: true
            },

            bidId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Bid",
                  required: true
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

            isDeposit: {
                  type: Boolean,
                  default: false
            },

            currency: {
                  type: String,
                  default: "USD"
            },
             // Add these fields for auction payments
    auctionItem: {
      type: String,
      required: function() { return !this.isDeposit; }
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function() { return !this.isDeposit; }
    },
    fees: {
      platformFee: {
        type: Number,
        default: 0
      },
      processingFee: {
        type: Number,
        default: 0
      }
    },
    netAmount: {
      type: Number,
      required: function() { return !this.isDeposit; }
    },
  
      gatewayResponse: Object // Store raw payment processor response
      },
      { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
