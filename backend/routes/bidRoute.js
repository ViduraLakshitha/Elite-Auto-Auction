import express from 'express';
import { ManageBid, getAllBidsByAuctionId } from '../controllers/bidController.js';

const router = express.Router();

router.post('/bid-place',ManageBid);
router.get('/bid-records/:id',getAllBidsByAuctionId);

export default router;