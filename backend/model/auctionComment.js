import mongoose from "mongoose";

const auctionCommentSchema = new mongoose.Schema(
    {
        auctionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auction",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Reference to the User collection
            required: true,
        },

        text: {
            type: String,
            required: true,
        },

        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        }
    }
    
);

export const Comment = mongoose.model("Comment", auctionCommentSchema);