import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
      {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference the Vehicle collection
            required: true,
        },


            vehicleId: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Vehicle", // Reference the Vehicle collection
                  required: true,
            },

            startDateTime: {
                type: Date,
                required: true,
                validate: {
                      validator: function (value) {
                            return this.endDate ? value < this.endDate : true;
                      },
                      message: "Start date must be before the end date",
                },
          },

          endDateTime: {
            type: Date,
            required: true,
            validate: {
                  validator: function (value) {
                        return this.startDate ? value > this.startDate : true;
                  },
                  message: "End date must be after the start date",
            },
      },

            initialVehiclePrice: {
                  type: Number,
                  required: true,
                  min: [0, "Price cannot be negative"], // Ensures price is not negative
            },

            isVerified: {
                type: Boolean,
                default: false,
              },
  

            currentBid: {
                  type: Number,
                  required: true,
                  default: 0, // Starts at 0 if no bids yet
            },

            auctionStates: {
                  type: String,
                  enum: ["pending", "active", "completed", "cancelled"], // Restrict valid states
                  default: "pending",
                  required: true,
            },

            remainingTime: {  
                type: Number,
                default: 0,
          },
      },
      { timestamps: true } // Adds createdAt and updatedAt fields
);

export const Auction = mongoose.model("Auction", auctionSchema);
