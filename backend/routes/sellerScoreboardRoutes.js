import { Router } from 'express';
import { getTopSellers } from '../controllers/sellerScoreboardController.js';



const router = Router();

// Fetch top 10 sellers
router.get('/sellers', getTopSellers);

export default router;
