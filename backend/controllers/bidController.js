import { Auction } from "../model/auction.js";
import { Bid } from "../model/bid.js";

const handleBidPlacement = async (auction, userId, bidAmount) => {
    // const currentDate = new Date();
    // const localOffset = currentDate.getTimezoneOffset() * 60000; // Get local timezone offset in milliseconds
    // const localDate = new Date(currentDate.getTime() - localOffset);

    // const currentTime = Date.now();

    // console.log(`current date ${currentDate}`);
    // console.log(`auction end date ${auction.endDateTime}`);
    
    
    // const auctionEndTime = currentTime + auction.remainingTime;

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
        auction.currentBid = bidAmount;
        console.log(auction.currentBid);
        
        auction.winningBid = bidAmount;

    }

        auction.currentBid = bidAmount;
        console.log(auction.currentBid);
        
        auction.winningBid = bidAmount;
    
    await auction.save();

    return {success: true, message: 'Bid Placed successfully'};
}

export const ManageBid = async (req, res) => {
    try {
        const{ auctionId, userId, bidAmount } = req.body;
        const auction = await Auction.findById(auctionId);
        
        if(!auction)
            return res.status(404).json({error: 'Auction not found'});
        
        const result = await handleBidPlacement(auction, userId, bidAmount);

        if(!result.success)
            return res.status(400).json({error: result.message});

        return res.status(200).json({message: result.message});
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}