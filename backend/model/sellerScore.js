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

            successfulCompletedAuctions: {
                  type: Number,
                  required: true,
                  min: [0, "Number of completed auctions cannot be negative"],
            },

            rank: {
                  type: Number,
                  required: true,
            },

            award: {
                  type: String,
                  enum: ["Gold", "Silver", "Bronze", "None"], // Restrict award types
                  default: "None",
            },
      },
      { timestamps: true }
);
// Pre-save hook to update rank based on completed auctions
sellerScoreSchema.pre("save", function (next) {
      this.rank = Math.max(1, Math.floor(this.successfulCompletedAuctions / 5));
      next();
});

sellerScoreSchema.pre("save", function (next) {
      this.rank = Math.max(1, Math.floor(this.successfulCompletedAuctions / 5));

      if (this.successfulCompletedAuctions >= 20) {
            this.award = "Gold";
      } else if (this.successfulCompletedAuctions >= 10) {
            this.award = "Silver";
      } else if (this.successfulCompletedAuctions >= 5) {
            this.award = "Bronze";
      } else {
            this.award = "None";
      }

      next();
});



const SellerScore = mongoose.model('SellerScore', sellerScoreSchema);
export default SellerScore;