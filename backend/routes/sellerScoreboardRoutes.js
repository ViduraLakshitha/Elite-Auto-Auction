// import { Router } from 'express';
// import { getTopSellers, updateSellerScoreboard } from '../controllers/sellerScoreboardController.js';

// const router = Router();

// // Fetch top 10 sellers
// router.get('/sellers', getTopSellers);

// // Manually update seller scoreboard
// router.get('/updateSeller', async (req, res) => {
//   await updateSellerScoreboard();
//   res.json({ message: "Scoreboard updated successfully" });
// });

// export default router;



import { Router } from 'express';
import { getTopSellers, updateSellerScoreboard } from '../controllers/sellerScoreboardController.js';


const router = Router();

// Fix: Corrected route to be `/sellers` (not `/sellers/sellers`)
router.get('/', getTopSellers);

// Fix: Proper response message for manual update
router.get('/update', async (req, res) => {
  try {
    await updateSellerScoreboard();
    res.json({ message: "Seller scoreboard updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating seller scoreboard", error: error.message });
  }
});

export default router;
