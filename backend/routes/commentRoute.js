import express from 'express';
import { addAuctionComment, getCommentsByAuction } from '../controllers/commentController.js';

const router = express.Router();

router.post('/comment-create',addAuctionComment);
router.get('/comment-all/:id',getCommentsByAuction);

export default router;