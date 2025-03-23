import express from 'express';
import { ManageBid } from '../controllers/bidController.js';

const router = express.Router();

router.post('/bid-place',ManageBid);

export default router;