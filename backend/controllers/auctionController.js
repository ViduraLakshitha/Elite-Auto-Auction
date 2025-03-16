import {Auction} from '../model/auction.js';

export const createAuction = async (req, res) => {
    try {
        if (
            !req.body.userId||
            !req.body.vehicleId||
            !req.body.startDateTime ||
            !req.body.endDateTime ||
            !req.body.initialVehiclePrice
        ) {
            return res.status(400).send({message: "send all required fields!"});
        }

        const newAuction = {
            userId:req.body.userId,
            vehicleId:req.body.vehicleId,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            initialVehiclePrice: req.body.initialVehiclePrice,
        };

        const auction = await Auction.create(newAuction);

        return res.status(201).json({ message: 'Auction Created Successfully', subject: auction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// function for updating auction status
export const updateAuctionStatuses = async () => {
    try {
        const currentDate = new Date();

        const localOffset = currentDate.getTimezoneOffset() * 60000; // Get local timezone offset in milliseconds
        const localDate = new Date(currentDate.getTime() - localOffset);

        await Auction.updateMany(
            { 
                startDateTime: { $gt: localDate }  
            },
            { $set: { auctionStatus: "scheduled" } }
        );

        await Auction.updateMany(
            { 
                startDateTime: { $lte: localDate },  
                endDateTime: { $gt: localDate }      
            },
            { $set: { auctionStatus: "active" } }
        );

        await Auction.updateMany(
            { 
                endDateTime: { $lte: localDate }
            },
            { $set: { auctionStatus: "ended" } }
        );
        
        console.log("Auction statuses updated successfully!");
    } catch (error) {
        console.error("Error updating auction statuses:", error.message);
    }
};


//find remaining time of an active auction and store
export const updateRemainingTime = async () => {
    try {
        const currentDate = new Date();
        
        const activeAuctions = await Auction.find({ auctionStatus: "active" });

        const updates = activeAuctions.map(async(auction) => {
            const remainingTime = new Date(auction.endDateTime) - currentDate; // Time difference in milliseconds
            await Auction.findByIdAndUpdate(auction._id,{remainingTime});
            return { 
                ...auction.toObject(), 
                remainingTime // Attach remaining time in milliseconds
            };
        });

        const result = await Promise.all(updates);

        console.log("Active Auctions with Updated Remaining Time:", result);

        console.log("get remaining time function executed!");

        //res.status(200).json(auctionsWithRemainingTime);
    } catch (error) {
        //res.status(500).json({ message: error.message });
        console.log("Error updating remaining time:", error.message);
        
    }
};


export const getAllAuctions = async (req, res) => {
    try{
        const auctions = await Auction.find({});
        return res.status(201).json({auctions})
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}

// router.get('/', async (req,res) => {
//     try {
//         const books = await Book.find({});
//         return res.status(201).json({
//             count:books.length,
//             data:books
//         });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).send({message:error.message})
        
//     }
// })