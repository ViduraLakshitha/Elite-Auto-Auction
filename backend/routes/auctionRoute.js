import express from 'express';
import { createAuction, getAllAuctions, getAuctionById } from '../controllers/auctionController.js';
import { trackUserClick, getRecommendedAuctions } from '../controllers/auctionController.js';
import { searchAuctions } from "../controllers/auctionController.js";

const router = express.Router();


router.post('/track-click', trackUserClick);
router.get('/recommended/:userId', getRecommendedAuctions);
router.post('/register',createAuction);
router.get('/details', getAllAuctions);
router.get('/details/single-auction/:id',getAuctionById);
router.get("/search", searchAuctions);

export default router;