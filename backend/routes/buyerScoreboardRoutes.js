import { Router } from 'express';
import { getTopBuyers } from '../controllers/buyerScoreboardController.js';

const router = Router();

// Fetch top 10 buyers
router.get('/buyers', getTopBuyers);

export default router;