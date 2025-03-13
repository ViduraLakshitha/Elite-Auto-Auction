import mongoose from "mongoose";

const sellerScoreSchema = new mongoose.Schema(
      {
            userId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User", // Reference to the User collection
                  required: true,
            },

            fullName: {
                  type: String,
                  required: true,
                  trim: true,
            },

            noOfCompletedAuctions: {
                  type: Number,
                  required: true,
                  min: [0, "Number of completed auctions cannot be negative"],
            },

            rank: {
                  type: Number,
                  default: function () {
                        return Math.max(1, Math.floor(this.noOfCompletedAuctions / 5)); // Example rank logic
                  },
            },

            award: {
                  type: String,
                  enum: ["Gold", "Silver", "Bronze", "None"], // Restrict award types
                  default: "None",
            },
      },
      { timestamps: true }
);

export const SellerScore = mongoose.model("SellerScore", sellerScoreSchema);
