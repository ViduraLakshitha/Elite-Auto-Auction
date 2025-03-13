// import mongoose from "mongoose";

// const bidSchema = new mongoose.Schema(
//       {
//             auctionId: {
//                   type: mongoose.Schema.Types.ObjectId,
//                   ref: "Auction", // Reference to the Auction collection
//                   required: true,
//             },

//             userId: {
//                   type: mongoose.Schema.Types.ObjectId,
//                   ref: "User", // Reference to the User collection
//                   required: true,
//             },

//             bidAmount: {
//                   type: Number,
//                   required: true,
//                   min: [1, "Bid amount must be greater than zero"], // Prevents negative bids
//                   validate: {
//                         validator: async function (value) {
//                               const auction = await mongoose.model("Auction").findById(this.auctionId);
//                               return auction ? value > auction.currentBid : false;
//                         },
//                         message: "Bid must be higher than the current bid",
//                   },
//             },

//             time: {
//                   type: Date,
//                   default: Date.now, // Automatically set bid time
//             },
//       },
//       { timestamps: true }
// );

// export const Bid = mongoose.model("Bid", bidSchema);
