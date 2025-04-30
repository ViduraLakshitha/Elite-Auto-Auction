import Auction from '../model/auction.js'; //  Corrected default import
import { io } from "../index.js"; // 
import Vehicle from "../model/vehicle.js"; // 
import { Bid } from "../model/bid.js"; // 
import User from '../model/userModel.js'; // 
import { UserInteractions } from '../model/userInteractions.js';

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
      newAuction.auctionStatus = "active";
      await newAuction.save();
    }

    io.emit("newAuctionCreated", newAuction);
    console.log("auctionCreated event emitted");

    return res.status(201).json({ message: 'Auction Created Successfully', auction: newAuction });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Auction Statuses (pending, active, completed)
export const updateAuctionStatuses = async () => {
  try {
    // const now = new Date();
    const currentDate = new Date();

    const localOffset = currentDate.getTimezoneOffset() * 60000;
    const localDate = new Date(currentDate.getTime() - localOffset);

    await Auction.updateMany(
      { startDateTime: { $gt: localDate } },
      { $set: { auctionStatus: "pending" } }
    );

    await Auction.updateMany(
      { 
        startDateTime: { $lte: localDate },  
        endDateTime: { $gt: localDate }      
      },
      { $set: { auctionStatus: "active" } }
    );

    await Auction.updateMany(
      { 
        endDateTime: { $lte: localDate }
      },
      { $set: { auctionStatus: "ended" } }
    );

    const endedAuctions = await Auction.find({ endDateTime: { $lte: localDate }, auctionStatus: "ended", finalWinnerUserId: { $ne:null } });
    console.log(`eeeeeeeeeeee${endedAuctions}`);
    
    
    // Emit to the clients (assuming you have access to io)
    endedAuctions.forEach(auction => {
        console.log(`Auction: ${auction._id}, finalWinnerUserId: ${auction.finalWinnerUserId}`);

        if (!auction.finalWinnerUserId) 
            console.error(`❗ Auction ${auction._id} has no winner!`);
        io.to(auction.finalWinnerUserId).emit('auctionEnded', auction);
    });

    //console.log("Auction statuses updated successfully!");
  } catch (error) {
    console.error("Error updating auction statuses:", error.message);
  }
};

// Update Remaining Time
export const updateRemainingTime = async () => {
  try {
    const now = new Date();

    const activeAuctions = await Auction.find({ auctionStatus: "active" });

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
    const auctions = await Auction.find({ auctionStatus: "active" })
      .populate({ path: "vehicleId" })
      .exec();

    return res.status(200).json({ auctions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get Auctions for Home Page (excluding active auctions)
export const getHomePageAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ auctionStatus: { $ne: "active" } })
      .populate({ path: "vehicleId" })
      .limit(6) // Limit to 6 auctions for the home page
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
    // Update seller (auction creator) stats
    await User.findByIdAndUpdate(auction.userId, {
      $inc: { successfulCompletedAuctions: 1 }
    });

    // Find winning bid (highest bid)
    const winningBid = await Bid.findOne({ auctionId: auction._id })
      .sort({ bidAmount: -1 });

    if (winningBid) {
      // Update winner (buyer) stats
      await User.findByIdAndUpdate(winningBid.userId, {
        $inc: { winningBids: 1 }
      });
    }
  } catch (error) {
    console.error("Error updating user stats:", error.message);
  }
};

// Controller to get the scoreboard
export const getScoreboard = async (req, res) => {
  try {
    const scoreboard = await Auction.find({
      auctionStatus: { $in: ["ended"] },
    })
      .populate("vehicleId", "vehicleName model") // only get name and model of vehicle
      .populate("finalWinnerUserId", "name email") // only get name and email of winner
      .sort({ winningBid: -1 }); // highest winning bid first

    res.status(200).json(scoreboard);
  } catch (error) {
    console.error("Error fetching scoreboard:", error);
    res.status(500).json({ message: "Failed to load scoreboard" });
  }
};

// Track user interactions when clicking an auction card
export const trackUserClick = async (req, res) => {
    try {
        const { userId, vehicleId } = req.body;

        // Fetch the vehicle to get its brand
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const vehicleBrand = vehicle.brand;

        // Find existing interaction record
        let interaction = await UserInteractions.findOne({ userId, brand: vehicleBrand });

        if (!interaction) {
            // Create new record if it doesn't exist
            interaction = new UserInteractions({ userId, brand: vehicleBrand, count: 1 });
        } else {
            // Increment count and update timestamp
            interaction.count += 1;
        }

        await interaction.save();
        return res.status(200).json({ message: "Click tracked successfully", interaction });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getRecommendedAuctions = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get user's top-clicked brands (threshold: count >= 5, within last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const topBrands = await UserInteractions.find({
            userId,
            count: { $gte: 5 },  // Only consider brands clicked at least 5 times
            updatedAt: { $gte: sevenDaysAgo }  // Filter recent interactions
        }).sort({ count: -1 });

        if (topBrands.length === 0) {
            return res.status(200).json({ message: "No recommendations found" });
        }

        // Fetch vehicle auctions for top-clicked brands
        const brands = topBrands.map(b => b.brand);
        const recommendedAuctions = await Auction.find({ auctionStatus: "active" })
            .populate({
                path: 'vehicleId',
                match: { brand: { $in: brands } }
            });

        return res.status(200).json({ recommendedAuctions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const searchAuctions = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const auctions = await Auction.find({
            auctionTitle: { $regex: query, $options: "i" }  // Case-insensitive search
        }).populate("vehicleId"); // Populate vehicle details if needed

        res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ message: "Error searching auctions", error });
    }
};

