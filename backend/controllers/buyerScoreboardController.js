import {User} from '../model/userModel.js';
import BuyerScore from '../model/buyerScore.js';

// Get top 10 buyers
export const getTopBuyers = async (req, res) => {
  try {
    const buyers = await User.find({ winningBids: { $gt: 0 } })
      .sort({ winningBids: -1 })
      .limit(10);
    res.json(buyers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update buyer scoreboard
export const updateBuyerScoreboard = async () => {
  const buyers = await User.find({ winningBids: { $gt: 0 } })
    .sort({ winningBids: -1 })
    .limit(10);

  await BuyerScore.deleteMany({}); // Clear existing scores
  for (let i = 0; i < buyers.length; i++) {
    await BuyerScore.create({
      userId: buyers[i]._id,
      winningBids: buyers[i].winningBids,
      rank: i + 1,
    });
  }
};
