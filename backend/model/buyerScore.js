import mongoose from "mongoose";

const buyerScoreSchema = new mongoose.Schema(
      {
            userId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User", // Reference to the User collection
                  required: true,
            },

            fname: {
                  type: String,
                  required: true,
                  trim: true, // Removes extra spaces
            },


            lname: {
                type: String,
                required: true,
                trim: true,
            },

            winningBids: {
                  type: Number,
                  required: true,
                  min: [0, "Number of wins cannot be negative"],
            },

            rank: {
                  type: Number,
                  required: true,
                  default: 1,
            },

            award: {
                  type: String,
                  enum: ["Gold", "Silver", "Bronze", "None"], // Restrict award types
                  default: "None",
            },
      },
      { timestamps: true }
);
buyerScoreSchema.pre("save", function (next) {
      // Rank logic
      this.rank = Math.max(1, Math.floor(this.winningBids / 5));
    
      // Award logic based on completed auctions
      if (this.winningBids >= 20) {
        this.award = "Gold";
      } else if (this.winningBids >= 10) {
        this.award = "Silver";
      } else if (this.winningBids >= 5) {
        this.award = "Bronze";
      } else {
        this.award = "None";
      }
    
      next();
    });

export default mongoose.model("BuyerScore", buyerScoreSchema);