// import { Auction } from "../model/auction.js";
// import { Bid } from "../model/bid.js";
// import { io } from "../index.js";  // Import Socket.IO instance

// const handleBidPlacement = async (auction, userId, bidAmount) => {
    
//     // check if the bid is greater than the initial vehicle price
//     if(auction.currentBid == 0){
        
//         if(bidAmount < auction.initialVehiclePrice + 250){
//             return { success: false, message: `Bid amount should greater than ${auction.initialVehiclePrice + 250}` };
//         }
//     }
 
//     // Check if bid is at least $250 greater than the currentBid
//     if (bidAmount < auction.currentBid + 250) {
//         return { success: false, message: 'Minimum bid increment 250$' };
//     }

//     // Check if bid is within the last 2 minutes of remaining time
//     const currentDate = new Date();

//     const correctedEndTime =  new Date(auction.endDateTime).getTime()-(5.5 * 60 * 60 * 1000);

//     console.log(`corrected end time ${correctedEndTime}`);
//     console.log(`cuurent date ${currentDate.getTime()}`);
//     //console.log(auction.endDateTime);
    
//     if((correctedEndTime - currentDate.getTime()) < 120000){
//         const endDateTime = new Date(auction.endDateTime);
//         const extendedEndTime = endDateTime.setMinutes(endDateTime.getMinutes() + 2);

//         console.log(new Date(extendedEndTime).toISOString());

//         auction.endDateTime = new Date(extendedEndTime).toISOString();
//         // Emit updated end time to clients
//         io.emit("auctionEndTimeUpdated", { auctionId: auction._id, endDateTime: auction.endDateTime });

//         auction.currentBid = bidAmount;        
//         auction.winningBid = bidAmount;

//     }
//         auction.currentBid = bidAmount;   
//         auction.winningBid = bidAmount;
    
//     await auction.save();

//     return {success: true, message: 'Bid Placed successfully'};
// }

// export const ManageBid = async (req, res) => {
//     try {
//         const{ auctionId, userId, bidAmount } = req.body;
//         const auction = await Auction.findById(auctionId);
        
//         if(!auction)
//             return res.status(404).json({error: 'Auction not found'});
        
//         const result = await handleBidPlacement(auction, userId, bidAmount);

//         if(!result.success)
//             return res.status(400).json({error: result.message});

//         // Emit the updated bid to all connected clients
//         io.emit("bidUpdated", { auctionId, currentBid: auction.currentBid });

//         return res.status(200).json({message: result.message});
        

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: error.message });
//     }
// }










import { Auction } from "../model/auction.js";
import { Bid } from "../model/bid.js";
import { io } from "../index.js"; // Import Socket.IO instance

const handleBidPlacement = async (auction, userId, bidAmount) => {
    // Check if the bid is greater than the initial vehicle price
    if (auction.currentBid == 0) {
        if (bidAmount < auction.initialVehiclePrice + 250) {
            return { success: false, message: `Bid amount should be greater than ${auction.initialVehiclePrice + 250}` };
        }
    }

    // Check if bid is at least $250 greater than the currentBid
    if (bidAmount < auction.currentBid + 250) {
        return { success: false, message: 'Minimum bid increment is $250' };
    }

    // Check if bid is within the last 2 minutes of remaining time
    const currentDate = new Date();
    const correctedEndTime = new Date(auction.endDateTime).getTime() - (5.5 * 60 * 60 * 1000);

    if ((correctedEndTime - currentDate.getTime()) < 120000) {
        const endDateTime = new Date(auction.endDateTime);
        const extendedEndTime = endDateTime.setMinutes(endDateTime.getMinutes() + 2);

        auction.endDateTime = new Date(extendedEndTime).toISOString();

        // Emit updated end time to clients
        io.emit("auctionEndTimeUpdated", {
            auctionId: auction._id,
            endDateTime: auction.endDateTime
        });

        console.log(`Auction ${auction._id} end time extended`);
    }

    // Update bid
    auction.currentBid = bidAmount;
    auction.winningBid = bidAmount;
    await auction.save();

    // Emit bid update to clients
    io.emit("bidUpdated", {
        auctionId: auction._id,
        currentBid: auction.currentBid,
        userId,
    });

    console.log(`Bid updated notification sent for Auction ${auction._id}`);

    return { success: true, message: 'Bid placed successfully' };
}

export const ManageBid = async (req, res) => {
    try {
        const { auctionId, userId, bidAmount } = req.body;
        const auction = await Auction.findById(auctionId);

        if (!auction) return res.status(404).json({ error: 'Auction not found' });

        const result = await handleBidPlacement(auction, userId, bidAmount);

        if (!result.success) return res.status(400).json({ error: result.message });

        // Check if auction has ended and notify the winner
        if (new Date(auction.endDateTime) <= new Date()) {
            const winningBid = await Bid.findOne({ auctionId }).sort({ bidAmount: -1 });
            if (winningBid) {
                io.emit("auctionWinner", {
                    auctionId: auction._id,
                    winnerId: winningBid.userId,
                    winningAmount: winningBid.bidAmount,
                });

                console.log(`Winner notification sent to User ${winningBid.userId}`);
            }
        }

        return res.status(200).json({ message: result.message });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}
