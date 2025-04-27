import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    auctionTitle: {
      type: String,
      required: true,
    },

    startDateTime: {
      type: Date,
      validate: {
        validator: function (value) {
          return this.endDateTime ? value < this.endDateTime : true;
        },
        message: "Start date must be before the end date",
      },
    },

    endDateTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return this.startDateTime ? value > this.startDateTime : true;
        },
        message: "End date must be after the start date",
      },
    },

    initialVehiclePrice: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    currentBid: {
      type: Number,
      required: true,
      default: 0,
    },

    auctionStates: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled"],
      default: "pending",
      required: true,
    },

    remainingTime: {
      type: Number,
      default: 0,
    },

    winningBid: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Auction", auctionSchema);
