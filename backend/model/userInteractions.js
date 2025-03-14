// import mongoose from "mongoose";

// const userInteractionsSchema = new mongoose.Schema(
//       {
//             userId: {
//                   type: mongoose.Schema.Types.ObjectId,
//                   ref: "User", // Reference to the User collection
//                   required: true,
//             },

//             brand: {
//                   type: String,
//                   required: true,
//                   trim: true, // Removes unnecessary spaces
//             },

//             count: {
//                   type: Number,
//                   required: true,
//                   min: [0, "Interaction count cannot be negative"], // Prevents negative counts
//                   default: 0, // Default value for new users
//             },
//       },
//       { timestamps: true }
// );

// // Add an index for faster queries when fetching interactions
// userInteractionsSchema.index({ userId: 1, brand: 1 }, { unique: true });

// export const UserInteractions = mongoose.model("UserInteractions", userInteractionsSchema);
