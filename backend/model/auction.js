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

            // auctionTitle: {
            //       type: String,
            //       required: true,
            // },


            startDateTime: {
                  type: Date,
                  //required: true,
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

            currentBid: {
                  type: Number,
                  default: 0, // Starts at 0 if no bids yet
            },

            auctionStatus: {
                  type: String,
                  enum: ["pending", "active", "end", "completed", "cancelled"], // Restrict valid states
                  default: "pending",
            },

            winningBid: {
                  type: Number,
                  default: 0,
            },
      },
      { timestamps: true } // Adds createdAt and updatedAt fields
);

export const Auction = mongoose.model("Auction", auctionSchema);
