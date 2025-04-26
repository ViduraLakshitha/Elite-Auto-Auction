import { Router } from 'express';
import { getTopSellers, updateSellerScoreboard } from '../controllers/sellerScoreboardController.js';


const router = Router();

// Corrected route to be "/sellers"
router.get('/', getTopSellers);

// Proper response message for manual update
router.get('/update', async (req, res) => {
  try {
    await updateSellerScoreboard();
    res.json({ message: "Seller scoreboard updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating seller scoreboard", error: error.message });
  }
});

export default router;
