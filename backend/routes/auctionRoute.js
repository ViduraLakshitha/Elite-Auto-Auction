import express from 'express';
import { createAuction, getAllAuctions, getAuctionById , getScoreboard } from '../controllers/auctionController.js';

const router = express.Router();

router.post('/register',createAuction);
router.get('/details', getAllAuctions);
router.get('/details/single-auction/:id',getAuctionById);
router.get("/scoreboard", getScoreboard);

//=========

const getTopCompletedAuctions = async () => {
    try {
      const result = await Auction.aggregate([
        { $match: { auctionStatus: "completed" } }, // Filter only completed auctions
        {
          $group: {
            _id: "$userId", // Group by userId
            completedAuctionsCount: { $sum: 1 } // Count completed auctions per user
          }
        },
        { $sort: { completedAuctionsCount: -1 } }, // Sort in descending order
        { $limit: 10 } // Get only top 10
      ]);
  
      return result; // Send this data to the frontend
    } catch (error) {
      console.error("Error fetching top completed auctions:", error);
    }
  };
  

router.get("/top-completed", async (req, res) => {
    try {
      const topUsers = await getTopCompletedAuctions(); // Call the function
      res.json(topUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });
  
export default router;