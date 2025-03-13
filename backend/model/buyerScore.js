import mongoose from "mongoose";

const buyerScoreSchema = new mongoose.Schema(
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

            noOfWins: {
                  type: Number,
                  required: true,
                  min: [0, "Number of wins cannot be negative"],
            },

            rank: {
                  type: Number,
                  default: function () {
                        return Math.max(1, Math.floor(this.noOfWins / 5)); // Example rank logic
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

export const BuyerScore = mongoose.model("BuyerScore", buyerScoreSchema);
