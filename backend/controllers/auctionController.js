import {Auction} from '../model/auction.js';
import { Bid } from "../model/bid.js";


export const createAuction = async (req, res) => {
    try {
        if (
            !req.body.userId||
            !req.body.vehicleId||
            !req.body.startDateTime ||
            !req.body.endDateTime ||
            !req.body.initialVehiclePrice
        ) {
            return res.status(400).send({message: "send all required fields!"});
        }

        const newAuction = {
            userId:req.body.userId,
            vehicleId:req.body.vehicleId,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            initialVehiclePrice: req.body.initialVehiclePrice,
        };

        const auction = await Auction.create(newAuction);

        return res.status(201).json({ message: 'Auction Created Successfully', subject: auction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// function for updating auction status
export const updateAuctionStatuses = async () => {
    try {
        const currentDate = new Date();

        const localOffset = currentDate.getTimezoneOffset() * 60000; // Get local timezone offset in milliseconds
        const localDate = new Date(currentDate.getTime() - localOffset);

        await Auction.updateMany(
            { 
                startDateTime: { $gt: localDate }  
            },
            { $set: { auctionStatus: "scheduled" } }
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
        
        console.log("Auction statuses updated successfully!");
    } catch (error) {
        console.error("Error updating auction statuses:", error.message);
    }
};


//find remaining time of an active auction and store
export const updateRemainingTime = async () => {
    try {
        const currentDate = new Date();
        
        const activeAuctions = await Auction.find({ auctionStatus: "active" });

        const updates = activeAuctions.map(async(auction) => {
            const remainingTime = new Date(auction.endDateTime) - currentDate; // Time difference in milliseconds
            await Auction.findByIdAndUpdate(auction._id,{remainingTime});
            return { 
                ...auction.toObject(), 
                remainingTime // Attach remaining time in milliseconds
            };
        });

        const result = await Promise.all(updates);

        console.log("Active Auctions with Updated Remaining Time:", result);

        console.log("get remaining time function executed!");

        //res.status(200).json(auctionsWithRemainingTime);
    } catch (error) {
        //res.status(500).json({ message: error.message });
        console.log("Error updating remaining time:", error.message);
        
    }
};


export const getAllAuctions = async (req, res) => {
    try{
        const auctions = await Auction.find({});
        return res.status(201).json({auctions})
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}
//=====
// In your auction completion logic
const updateUserStats = async (auction) => {
    // Update seller stats
    await User.findByIdAndUpdate(auction.userId, {
      $inc: { successfulCompletedAuctions: 1 }
    });
    
    // Find winning bid and update buyer stats
    const winningBid = await Bid.findOne({ auctionId: auction._id })
      .sort({ bidAmount: -1 })
      .limit(1);
    
    if (winningBid) {
      await User.findByIdAndUpdate(winningBid.userId, {
        $inc: { winningBids: 1 }
      });
    }
  };

  // Controller to get the scoreboard
export const getScoreboard = async (req, res) => {
  try {
    const scoreboard = await Auction.find({
      auctionStatus: { $in: ["ended", "completed"] },
      winningBid: { $gt: 0 },
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