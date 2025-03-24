import { User } from "../model/userModel.js";

// Get top 10 sellers
export const getTopSellers = async (req, res) => {
  try {
    const sellers = await User.find({ successfulCompletedAuctions: { $gt: 0 } })
      .sort({ successfulCompletedAuctions: -1 })
      .limit(10);

    if (!sellers.length) {
      return res.status(404).json({ message: "No top sellers found" });
    }

    // Add rank and award dynamically
    const sellersWithRankAndAward = sellers.map((seller, index) => {
      const sellerRank = index + 1;
      let sellerAward = "None";
      if (seller.successfulCompletedAuctions >= 20) {
        seller.Award = "Gold";
      } else if (seller.successfulCompletedAuctions >= 10) {
        sellerAward = "Silver";
      } else if (seller.successfulCompletedAuctions >= 5) {
        sellerAward = "Bronze";
      }
      return { ...seller.toObject(), sellerRank, sellerAward };
    });

    res.json(sellersWithRankAndAward);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update seller scoreboard
export const updateSellerScoreboard = async () => {
  try {
    const sellers = await User.find({ successfulCompletedAuctions: { $gt: 0 } })
      .sort({ successfulCompletedAuctions: -1 })
      .limit(10);

    if (!sellers.length) {
      console.log("No sellers to update");
      return;
    }

    const operations = sellers.map((seller, index) => {
      const sellerRank = index + 1;
      let sellerAward = "None";
      if (seller.successfulCompletedAuctions >= 20) {
        sellerAward = "Gold";
      } else if (seller.successfulCompletedAuctions >= 10) {
        sellerAward = "Silver";
      } else if (seller.successfulCompletedAuctions >= 5) {
        sellerAward = "Bronze";
      }
      return {
        updateOne: {
          filter: { _id: seller._id },
          update: {
            $set: {
              _id: seller._id,
              fname: seller.fname,
              lname: seller.lname,
              successfulCompletedAuctions: seller.successfulCompletedAuctions,
              sellerRank,
              sellerAward,
            },
          },
          upsert: true,
        },
      };
    });

    await User.bulkWrite(operations);
    console.log("Seller scoreboard updated successfully");
  } catch (err) {
    console.error("Error updating seller scoreboard:", err.message);
    throw err;
  }
};