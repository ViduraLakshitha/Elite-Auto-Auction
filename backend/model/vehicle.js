import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
      {
            userId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User", // Reference to the User collection
                  required: true,
            },

            brand: {
                  type: String,
                  required: true,
                  trim: true,
            },

            model: {
                  type: String,
                  required: true,
                  trim: true,
            },

            year: {
                  type: Number,
                  required: true,
                  min: [1886, "Enter a valid year!"],
                  max: [new Date().getFullYear() + 1, "Enter a valid year!"],
            },

            currentLocation: {
                  type: String,
                  required: true,
                  trim: true,
            },

            vehicleType: {
                  type: String,
                  enum: ["classic","luxury"],
                  required: true,
            },

            condition: {
                  type: String,
                  enum: ["new", "used"],
                  required: true,
            },

            description: {
                  type: String,
                  required: true,
                  trim: true,
            },

            images: {
                  type: [String], // Allows multiple images
                  required: false,
            },

            documents: {
                  type: [String], // Allows multiple documents
                  
            },
      },
      { timestamps: true }
);

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);
