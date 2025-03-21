import { Router } from 'express';
import { getTopBuyers, updateBuyerScoreboard } from '../controllers/buyerScoreboardController.js';

const router = Router();

// Fetch top 10 buyers
router.get('/', getTopBuyers);

// Manually update buyer scoreboard
router.get('/update', async (req, res) => {
try {
  await updateBuyerScoreboard();
  res.json({ message: "Buyer Scoreboard updated successfully" });
} catch (error) {
  res.status(500).json({ message: "Error updating seller scoreboard", error: error.message });
}
});

export default router;