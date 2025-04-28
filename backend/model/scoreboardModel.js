import mongoose from "mongoose";

const scoreBoardSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      email: String,
    },
    winningBid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Scoreboard = mongoose.model("Scoreboard", scoreBoardSchema);
