import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    initialVehiclePrice: {
      type: Number,
      required: true,
      min: [0, "Starting bidding price cannot be negative!"],
    },
    startDateTime: {
      type: Date,
      required: false, // Optional
    },
    endDateTime: {
      type: Date,
      required: false, // Optional
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Auction = mongoose.model('Auction', auctionSchema);
export default Auction;
