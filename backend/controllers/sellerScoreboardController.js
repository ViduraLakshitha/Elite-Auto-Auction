import User from '../model/userModel.js';
import SellerScore from '../model/sellerScore.js';

// Get top 10 sellers
export const getTopSellers = async (req, res) => {
  try {
    const sellers = await User.find({ successfulCompletedAuctions: { $gt: 0 } })
      .sort({ successfulCompletedAuctions: -1 })
      .limit(10);
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update seller scoreboard
export const updateSellerScoreboard = async () => {
  const sellers = await User.find({ successfulCompletedAuctions: { $gt: 0 } })
    .sort({ successfulCompletedAuctions: -1 })
    .limit(10);

  await SellerScore.deleteMany({}); // Clear existing scores
  for (let i = 0; i < sellers.length; i++) {
    await SellerScore.create({
      userId: sellers[i]._id,
      successfulCompletedAuctions: sellers[i].successfulCompletedAuctions,
      rank: i + 1,
    });
  }
};
