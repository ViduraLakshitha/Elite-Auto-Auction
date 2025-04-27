import Auction from "../model/auction.js"; // ✅ Correct import
import { io } from "../index.js"; // Import io from index.js which is the main file
import Vehicle from "../model/vehicle.js"; // ✅ Correct import
//import User from "../model/user.js"; // ✅ Added User model import
//import Bid from "../model/bid.js"; // ✅ Added Bid model import
import { Bid } from "../model/bid.js";
import User from '../model/userModel.js';



// Create Auction
export const createAuction = async (req, res) => {
    try {
        const { userId, vehicleId, auctionTitle, startDateTime, endDateTime, initialVehiclePrice } = req.body;

        if (!userId || !vehicleId || !auctionTitle || !endDateTime || !initialVehiclePrice) {
            return res.status(400).json({ message: "Send all required fields!" });
        }

        const newAuction = await Auction.create({
            userId,
            vehicleId,
            auctionTitle,
            startDateTime,
            endDateTime,
            initialVehiclePrice,
        });

        console.log("New auction created:", newAuction);

        if (!startDateTime) {
            newAuction.auctionStates = "active";
            await newAuction.save();
        }

        io.emit("newAuctionCreated", newAuction);
        console.log("auctionCreated event emitted");

        return res.status(201).json({ message: 'Auction Created Successfully', auction: newAuction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update Auction Statuses (scheduled, active, ended)
export const updateAuctionStatuses = async () => {
    try {
        const now = new Date();

        await Auction.updateMany(
            { startDateTime: { $gt: now } },
            { $set: { auctionStates: "pending" } }
        );

        await Auction.updateMany(
            { startDateTime: { $lte: now }, endDateTime: { $gt: now } },
            { $set: { auctionStates: "active" } }
        );

        await Auction.updateMany(
            { endDateTime: { $lte: now } },
            { $set: { auctionStates: "completed" } }
        );

        console.log("Auction statuses updated successfully!");
    } catch (error) {
        console.error("Error updating auction statuses:", error.message);
    }
};

// Update Remaining Time
export const updateRemainingTime = async () => {
    try {
        const now = new Date();

        const activeAuctions = await Auction.find({ auctionStates: "active" });

        const updates = activeAuctions.map(async (auction) => {
            const remaining = Math.max(0, Math.floor((new Date(auction.endDateTime) - now) / 1000));
            auction.remainingTime = remaining;
            await auction.save();
        });

        await Promise.all(updates);
        console.log("Updated remaining time for active auctions");

    } catch (error) {
        console.error("Error updating remaining time:", error.message);
    }
};

// Get All Active Auctions
export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({ auctionStates: "active" })
            .populate({ path: "vehicleId" })
            .exec();

        return res.status(200).json({ auctions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get Auction By ID
export const getAuctionById = async (req, res) => {
    try {
        const { id } = req.params;

        const auction = await Auction.findById(id)
            .populate({ path: "vehicleId" })
            .exec();

        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        return res.status(200).json(auction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update Seller and Buyer Stats after auction completion
const updateUserStats = async (auction) => {
    try {
        await User.findByIdAndUpdate(auction.userId, {
            $inc: { successfulCompletedAuctions: 1 }
        });

        const winningBid = await Bid.findOne({ auctionId: auction._id })
            .sort({ bidAmount: -1 })
            .limit(1);

        if (winningBid) {
            await User.findByIdAndUpdate(winningBid.userId, {
                $inc: { winningBids: 1 }
            });
        }
    } catch (error) {
        console.error("Error updating user stats:", error.message);
    }
};
