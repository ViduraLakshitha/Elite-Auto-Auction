// import mongoose from "mongoose";

// const vehicleSchema = new mongoose.Schema(
//       {
//             userId: {
//                   type: mongoose.Schema.Types.ObjectId,
//                   ref: "User", // Reference to the User collection
//                   required: true,
//             },

//             brand: {
//                   type: String,
//                   required: true,
//                   trim: true,
//             },

//             model: {
//                   type: String,
//                   required: true,
//                   trim: true,
//             },

//             year: {
//                   type: Number,
//                   required: true,
//                   min: [1886, "Invalid year. Cars didn't exist before 1886!"],
//                   max: [new Date().getFullYear() + 1, "Invalid year. Cannot be a future model!"],
//             },

//             currentLocation: {
//                   type: String,
//                   required: true,
//                   trim: true,
//             },

//             vehicleType: {
//                   type: String,
//                   enum: ["Sedan", "SUV", "Truck", "Coupe", "Convertible", "Electric", "Hybrid", "Classic", "Other"],
//                   required: true,
//             },

//             condition: {
//                   type: String,
//                   enum: ["New", "Used", "Salvage"],
//                   required: true,
//             },

//             description: {
//                   type: String,
//                   required: true,
//                   trim: true,
//             },

//             images: {
//                   type: [String], // Allows multiple images
//                   required: true,
//             },

//             documents: {
//                   type: [String], // Allows multiple documents
//                   required: true,
//             },
//       },
//       { timestamps: true }
// );

// export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
