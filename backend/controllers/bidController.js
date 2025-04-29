import { Auction } from "../model/auction.js";
import { Bid } from "../model/bid.js";
import { io } from "../index.js";  // Import Socket.IO instance
import User from "../model/userModel.js";

const handleBidPlacement = async (auction, userId, bidAmount) => {
    console.log(`handlebid userid ${userId}`);
    
    // check if the bid is greater than the initial vehicle price
    if(auction.currentBid == 0){
        
        if(bidAmount < auction.initialVehiclePrice + 250){
            return { success: false, message: `Bid amount should greater than ${auction.initialVehiclePrice + 250}` };
        }
    }
 
    // Check if bid is at least $250 greater than the currentBid
    if (bidAmount < auction.currentBid + 250) {
        return { success: false, message: 'Minimum bid increment 250$' };
    }

    // Check if bid is within the last 2 minutes of remaining time
    const currentDate = new Date();

    const correctedEndTime =  new Date(auction.endDateTime).getTime()-(5.5 * 60 * 60 * 1000);

    console.log(`corrected end time ${correctedEndTime}`);
    console.log(`cuurent date ${currentDate.getTime()}`);
    //console.log(auction.endDateTime);
    
    if((correctedEndTime - currentDate.getTime()) < 120000){
        const endDateTime = new Date(auction.endDateTime);
        const extendedEndTime = endDateTime.setMinutes(endDateTime.getMinutes() + 2);

        console.log(new Date(extendedEndTime).toISOString());

        auction.endDateTime = new Date(extendedEndTime).toISOString();
        // Emit updated end time to clients
        io.emit("auctionEndTimeUpdated", { auctionId: auction._id, endDateTime: auction.endDateTime });

        // auction.currentBid = bidAmount;       
        // auction.winningBid = bidAmount;
        // auction.bidCount++;

    }
        auction.currentBid = bidAmount;   
        auction.winningBid = bidAmount;
        auction.finalWinnerUserId = userId;       //added on 28th april
        auction.bidCount++;
    
    await auction.save();

    // 👉 Create a new Bid record
    const newBid = new Bid({
        auctionId: auction._id,
        userId,
        bidAmount,
    });

    await newBid.save();

    // 👉 Fetch user details to get user name
    const user = await User.findById(userId);  
    
    io.emit("newBidPlaced", { auctionId: auction._id, bidCount: auction.bidCount });

    io.emit("bidPlaced", {
        auctionId: auction._id,
        amount: auction.currentBid,
        placedBy: user.fName, // maybe you can populate the username if needed
        placedAt: new Date(), // timestamp
    });
    


    return {success: true, message: 'Bid Placed successfully'};
}

export const ManageBid = async (req, res) => {
    try {
        console.log("im inside managebid");
        
        const{ auctionId, userId, bidAmount } = req.body;     //changed here today===========================
        console.log(`managebid userid ${userId}`);
        
        const auction = await Auction.findById(auctionId); //here
        
        if(!auction)
            return res.status(404).json({error: 'Auction not found'});
        
        const result = await handleBidPlacement(auction, userId, bidAmount);

        if(!result.success)
            return res.status(400).json({error: result.message});

        // Emit the updated bid to all connected clients
        io.emit("bidUpdated", { auctionId, currentBid: auction.currentBid });

        return res.status(200).json({message: result.message});
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

// export const getAllBidsByAuctionId=async(req,res)=>{
//     try{
//         const {id} = req.params;
//         const Bids=await Bid.find({auctionId:id});

//         if(!Bids){
//             return res.status(404).json({message: "Bids not found"})
//         }

//         return res.status(201).json({Bids})
//     }catch(error){
//         return res.status(500).json({message: error.message})
//     }
// }


export const getAllBidsByAuctionId = async (req, res) => {
    try {
        const { id } = req.params; // Get auction ID from URL
        const bids = await Bid.find({ auctionId: id })
        .populate('userId', 'fName'); // Fetch bids

        // if (bids.length === 0) {  // Check if no bids exist
        //     return res.status(404).json({ message: "No bids found for this auction." });
        // }

        return res.status(200).json(bids); 
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
