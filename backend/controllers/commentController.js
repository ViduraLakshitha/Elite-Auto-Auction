import { Comment } from "../model/auctionComment.js";
import {io} from "../index.js";

// export const createComment = async (req, res) => {
//     try {
//         if (
//             !req.body.auctionId||
//             !req.body.userId||
//             !req.body.text
//         ) {
//             return res.status(400).send({message: "send all required fields!"});
//         }

//         const newComment = {
//             auctionId:req.body.auctionId,
//             userId:req.body.userId,
//             text:req.body.text,
//             parentId:req.body.parentId,
//         };

//         const comment = await Comment.create(newComment);
//         console.log("New comment created:", comment);

//         return res.status(201).json({ message: 'Comment Created Successfully', subject: comment });

//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// }


// export const getAllCommentsByAuctionId = async (req, res) => {
//     try {
//         const { id } = req.params; // Get the auction ID from URL parameters
//         const comments = await Comment.findById(id)
//         .populate({
//             path:'userId',
//         })
//         .exec(); //.populate("userId vehicleId"); // Populate related data if needed

//         if (!comments) {
//             return res.status(404).json({ message: "comments not found" });
//         }

//         return res.status(200).json(comments);
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };

// controllers/auctionCommentController.js


// Get all comments for a specific auction
export const getCommentsByAuction = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`aaaaaaaa${id}`);
    
    const comments = await Comment.find({ auctionId:id })
      //.sort({ createdAt: 1 }); // oldest first
      .populate('userId', 'fName');

    res.status(200).json(comments);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching comments" });
  }
};

// Add a new comment (or reply)
export const addAuctionComment = async (req, res) => {
  try {
    const { auctionId, userId, text, parentId } = req.body;

    if (!text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const newComment = new Comment({
      auctionId,
      userId,
      text,
      parentId: parentId || null,
    });

    const savedComment = await newComment.save();

    // Broadcast the new comment to all users
    io.emit("newAuctionComment", savedComment);

    res.status(201).json(savedComment);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding comment" });
  }
};
