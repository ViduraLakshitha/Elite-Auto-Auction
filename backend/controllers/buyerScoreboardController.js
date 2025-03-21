import {User} from '../model/userModel.js';
import {BuyerScore} from '../model/buyerScore.js';

// Get top 10 buyers
export const getTopBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ winningBids: { $gt: 0 } })
      .sort({ winningBids: -1 })
      .limit(10);
      console.log(`####################${buyers}`);
    
    if (!buyers.length) {
      return res.status(404).json({ message: "No top sellers found" });
    }

    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update buyer scoreboard
export const updateBuyerScoreboard = async () => {
  try {
    const buyers = await User.find({ winningBids: { $gt: 0 } })
      .sort({ winningBids: -1 })
      .limit(10);
    
    if (!buyers.length) {
      console.log("No buyers to update");
      return;
    }

    const operations = buyers.map((buyer, index) => ({
      updateOne: {
        filter: { userId: buyer._id },
        update: {
          $set: {
            userId: buyer._id,
            fullName: `${buyer.fName} ${buyer.lname}`,
            winningBids: buyer.winningBids,
            rank: index + 1,
          },
        },
        upsert: true,
      },
    }));

    await BuyerScore.bulkWrite(operations);
    console.log("Buyer scoreboard updated successfully");
  } catch (err) {
    console.error("Error updating buyer scoreboard:", err.message);
  }
};
