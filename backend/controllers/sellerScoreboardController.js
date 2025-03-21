// import { User } from "../model/userModel.js";
// import { SellerScore } from "../model/sellerScore.js";

// // Get top 10 sellers
// export const getTopSellers = async (req, res) => {
//   try {
//     const sellers = await User.find({ successfulCompletedAuctions: { $gt: 0 } })
//       .sort({ successfulCompletedAuctions: -1 })
//       .limit(10);
//     res.json(sellers);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // Update seller scoreboard
// export const updateSellerScoreboard = async () => {
//   try {
//     // Fetch top 10 sellers based on successfulCompletedAuctions
//     const sellers = await User.find({ successfulCompletedAuctions: { $gt: 0 } })
//       .sort({ successfulCompletedAuctions: -1 })
//       .limit(10);

//     // Prepare bulk write operations
//     const operations = sellers.map((seller, index) => ({
//       updateOne: {
//         filter: { userId: seller._id }, // Match by userId
//         update: {
//           $set: {
//             userId: seller._id,
//             fullName: `${seller.fName} ${seller.lname}`,
//             successfulCompletedAuctions: seller.successfulCompletedAuctions,
//             rank: index + 1, // Assign rank based on position
//           },
//         },
//         upsert: true, // Create if it doesn't exist
//       },
//     }));

//     // Execute bulk write operations
//     await SellerScore.bulkWrite(operations);

//     console.log("Seller scoreboard updated successfully");
//   } catch (err) {
//     console.error("Error updating seller scoreboard:", err.message);
//     throw err; // Re-throw the error for further handling
//   }
// };



import { User } from "../model/userModel.js";
import { SellerScore } from "../model/sellerScore.js";

// Fix: Added error handling & ensured `User` collection has data
export const getTopSellers = async (req, res) => {
  try {
    const sellers = await User.find({ successfulCompletedAuctions: { $gt: 0 } })
      .sort({ successfulCompletedAuctions: -1 })
      .limit(10);
      console.log("Executed getTopSellers");
      console.log(`####################${sellers}`);

    if (!sellers.length) {
      return res.status(404).json({ message: "No top sellers found" });
    }

    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fix: Ensure sellers get updated correctly
export const updateSellerScoreboard = async () => {
  try {
    const sellers = await User.find({ successfulCompletedAuctions: { $gt: 0 } })
      .sort({ successfulCompletedAuctions: -1 })
      .limit(10);

    if (!sellers.length) {
      console.log("No sellers to update");
      return;
    }

    const operations = sellers.map((seller, index) => ({
      updateOne: {
        filter: { userId: seller._id },
        update: {
          $set: {
            userId: seller._id,
            fullName: `${seller.fName} ${seller.lname}`,
            successfulCompletedAuctions: seller.successfulCompletedAuctions,
            rank: seller.rank,
          },
        },
        upsert: true,
      },
    }));

    await SellerScore.bulkWrite(operations);
    console.log("Seller scoreboard updated successfully");
  } catch (err) {
    console.error("Error updating seller scoreboard:", err.message);
    throw err;
  }
};
