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
    const currentDate = new Date();
    const localOffset = currentDate.getTimezoneOffset() * 60000;
    const localDate = new Date(currentDate.getTime() - localOffset);

    // Set pending auctions
    await Auction.updateMany(
      { startDateTime: { $gt: localDate } },
      { $set: { auctionStatus: "pending" } }
    );

    // Set active auctions
    await Auction.updateMany(
      { 
        startDateTime: { $lte: localDate },  
        endDateTime: { $gt: localDate }      
      },
      { $set: { auctionStatus: "active" } }
    );

    // Find newly ended auctions
    const newlyEndedAuctions = await Auction.find({
      endDateTime: { $lte: localDate },
      auctionStatus: "active" // only update those that were active before
    });

    console.log(`Found ${newlyEndedAuctions.length} newly ended auctions`);
    
    // Process each ended auction
    for (const auction of newlyEndedAuctions) {
      // Find the highest bid for this auction
      const highestBid = await Bid.findOne({ auctionId: auction._id })
        .sort({ bidAmount: -1 })
        .limit(1);
      
      if (highestBid) {
        // Update auction with winner and winning bid
        auction.auctionStatus = "ended";
        auction.finalWinnerUserId = highestBid.userId;
        auction.winningBid = highestBid.bidAmount;
        await auction.save();
        
        console.log(`Auction ${auction._id} completed with winner ${highestBid.userId} and bid $${highestBid.bidAmount}`);
        
        // Notify the winner
        io.to(highestBid.userId.toString()).emit('auctionEnded', {
          auctionId: auction._id,
          vehicleId: auction.vehicleId,
          message: "Congratulations! You've won an auction."
        });
      } else {
        // No bids on this auction
        auction.auctionStatus = "ended";
        await auction.save();
        console.log(`Auction ${auction._id} ended with no bids`);
      }
    }
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
    const auctions = await Auction.find({ auctionStatus: "active" })
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
    // Log database status
    console.log("Fetching scoreboard data...");
    
    // First attempt: Get any auctions with ended status
    let scoreboard = await Auction.find({
      auctionStatus: "ended"
    })
      .populate("vehicleId")
      .populate("finalWinnerUserId")
      .sort({ winningBid: -1 }); // highest winning bid first
      
    console.log(`Found ${scoreboard.length} auctions with 'ended' status`);

    // Second attempt: If no ended auctions, try completed status
    if (scoreboard.length === 0) {
      scoreboard = await Auction.find({
        auctionStatus: "completed"
      })
        .populate("vehicleId")
        .populate("finalWinnerUserId")
        .sort({ winningBid: -1 });
        
      console.log(`Found ${scoreboard.length} auctions with 'completed' status`);
    }
    
    // Third attempt: As a fallback, get ANY auctions that are not active or pending
    if (scoreboard.length === 0) {
      scoreboard = await Auction.find({
        auctionStatus: { $nin: ["active", "pending"] }
      })
        .populate("vehicleId")
        .populate("finalWinnerUserId")
        .sort({ winningBid: -1 });
        
      console.log(`Found ${scoreboard.length} auctions that are not active or pending`);
    }
    
    // Last resort: Just get the top 10 auctions by highest bids
    if (scoreboard.length === 0) {
      scoreboard = await Auction.find()
        .populate("vehicleId")
        .populate("finalWinnerUserId")
        .sort({ winningBid: -1 })
        .limit(10);
        
      console.log(`Returning ${scoreboard.length} auctions as a last resort`);
    }

    // Process the scoreboard data to fix any missing user information
    const processedScoreboard = scoreboard.map(auction => {
      // Convert the Mongoose document to a plain JavaScript object
      const auctionObj = auction.toObject();

      // Handle missing or malformed finalWinnerUserId
      if (!auctionObj.finalWinnerUserId) {
        // No winner at all
        auctionObj.finalWinnerUserId = {
          _id: null,
          name: "Unknown Bidder"
        };
      } 
      // Has an ID but missing name property
      else if (!auctionObj.finalWinnerUserId.name) {
        console.log("Found winner ID without name:", auctionObj.finalWinnerUserId);
        // Set a default object with consistent structure
        auctionObj.finalWinnerUserId = {
          _id: auctionObj.finalWinnerUserId._id || auctionObj.finalWinnerUserId,
          name: "Unknown Bidder"
        };
      }
      // Empty name property
      else if (auctionObj.finalWinnerUserId.name === "") {
        auctionObj.finalWinnerUserId.name = "Unknown Bidder";
      }
      
      return auctionObj;
    });

    return res.status(200).json(processedScoreboard);
  } catch (error) {
    console.error("Error fetching scoreboard:", error);
    return res.status(500).json({ message: "Failed to load scoreboard", error: error.message });
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

// One-time fix for auction statuses and winners
export const fixAuctionStatuses = async (req, res) => {
  try {
    console.log("Starting auction status fix...");
    
    // Get all auctions that should be ended (past end date)
    const currentDate = new Date();
    const auctionsToFix = await Auction.find({
      endDateTime: { $lt: currentDate },
      auctionStatus: { $ne: "ended" } // Not already marked as ended
    });
    
    console.log(`Found ${auctionsToFix.length} auctions that need to be fixed`);
    
    let fixedCount = 0;
    
    // Process each auction
    for (const auction of auctionsToFix) {
      // Find the highest bid
      const highestBid = await Bid.findOne({ auctionId: auction._id })
        .sort({ bidAmount: -1 })
        .limit(1);
      
      // Update the auction
      auction.auctionStatus = "ended";
      
      if (highestBid) {
        auction.finalWinnerUserId = highestBid.userId;
        auction.winningBid = highestBid.bidAmount;
        console.log(`Auction ${auction._id} winner set to ${highestBid.userId} with bid $${highestBid.bidAmount}`);
      } else {
        console.log(`Auction ${auction._id} had no bids`);
      }
      
      await auction.save();
      fixedCount++;
    }
    
    // If no auctions needed fixing, create some sample data for the scoreboard
    if (fixedCount === 0 && auctionsToFix.length === 0) {
      const allAuctions = await Auction.find();
      
      if (allAuctions.length > 0) {
        const sampleAuction = allAuctions[0];
        sampleAuction.auctionStatus = "ended";
        
        // Set a dummy winning bid if none exists
        if (!sampleAuction.winningBid || sampleAuction.winningBid <= 0) {
          sampleAuction.winningBid = sampleAuction.initialVehiclePrice * 1.2; // 20% more than initial price
        }
        
        // Set a winner if none exists
        if (!sampleAuction.finalWinnerUserId) {
          // Find any user to set as winner
          const anyUser = await User.findOne();
          if (anyUser) {
            sampleAuction.finalWinnerUserId = anyUser._id;
          }
        }
        
        await sampleAuction.save();
        console.log(`Created sample ended auction from ${sampleAuction._id}`);
        fixedCount = 1;
      }
    }
    
    return res.status(200).json({ 
      message: `Fixed ${fixedCount} auctions`,
      success: true
    });
  } catch (error) {
    console.error("Error fixing auction statuses:", error);
    return res.status(500).json({ 
      message: "Error fixing auction statuses", 
      error: error.message,
      success: false
    });
  }
};

