import { Router } from 'express';
import SellerScore from '../model/sellerScore.js';
import { getTopSellers } from '../controllers/sellerScoreboardController.js';



const router = Router();

// Fetch top 10 sellers
router.get('/sellers', getTopSellers);

export default router;
