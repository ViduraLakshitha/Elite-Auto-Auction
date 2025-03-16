import express from 'express';
import { createAuction, getAllAuctions } from '../controllers/auctionController.js';

const router = express.Router();

router.post('/register',createAuction);
router.get('/details', getAllAuctions);

export default router;