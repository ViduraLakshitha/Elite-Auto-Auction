import { User } from "../model/userModel.js";

// Get top 10 buyers
export const getTopBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ winningBids: { $gt: 0 } })
      .sort({ winningBids: -1 })
      .limit(10);

    if (!buyers.length) {
      return res.status(404).json({ message: "No top buyers found" });
    }

    // Add rank and award dynamically
    const buyersWithRankAndAward = buyers.map((buyer, index) => {
      const buyerRank = index + 1;
      let buyerAward = "None";
      if (buyer.winningBids >= 20) {
        buyerAward = "Gold";
      } else if (buyer.winningBids >= 10) {
        buyerAward = "Silver";
      } else if (buyer.winningBids >= 5) {
        buyerAward = "Bronze";
      }
      return { ...buyer.toObject(), buyerRank, buyerAward };
    });

    res.json(buyersWithRankAndAward);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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

    const operations = buyers.map((buyer, index) => {
      const buyerRank = index + 1;
      let buyerAward = "None";
      if (buyer.winningBids >= 20) {
        buyerAward = "Gold";
      } else if (buyer.winningBids >= 10) {
        buyerAward = "Silver";
      } else if (buyer.winningBids >= 5) {
        buyerAward = "Bronze";
      }
      return {
        updateOne: {
          filter: { _id: buyer._id },
          update: {
            $set: {
              _id: buyer._id,
              fname: buyer.fname,
              lname: buyer.lname,
              winningBids: buyer.winningBids,
              buyerRank,
              buyerAward,
            },
          },
          upsert: true,
        },
      };
    });

    await User.bulkWrite(operations);
    console.log("Buyer scoreboard updated successfully");
  } catch (err) {
    console.error("Error updating buyer scoreboard:", err.message);
    throw err;
  }
};