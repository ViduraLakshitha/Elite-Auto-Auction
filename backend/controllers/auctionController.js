import Auction from '../model/auction.js'; // 

export const createAuction = async (req, res) => {
    try {
        if (
            !req.body.userId ||
            !req.body.vehicleId ||
            !req.body.startDateTime ||
            !req.body.endDateTime ||
            !req.body.initialVehiclePrice
        ) {
            return res.status(400).send({ message: "Send all required fields!" });
        }

        const newAuction = {
            userId: req.body.userId,
            vehicleId: req.body.vehicleId,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            initialVehiclePrice: req.body.initialVehiclePrice,
        };

        const auction = await Auction.create(newAuction);

        return res.status(201).json({ message: 'Auction Created Successfully', auction });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Function for updating auction status
export const updateAuctionStatuses = async () => {
    try {
        const currentDate = new Date();
        const localOffset = currentDate.getTimezoneOffset() * 60000;
        const localDate = new Date(currentDate.getTime() - localOffset);

        await Auction.updateMany(
            { startDateTime: { $gt: localDate } },
            { $set: { auctionStatus: "scheduled" } }
        );

        await Auction.updateMany(
            { startDateTime: { $lte: localDate }, endDateTime: { $gt: localDate } },
            { $set: { auctionStatus: "active" } }
        );

        await Auction.updateMany(
            { endDateTime: { $lte: localDate } },
            { $set: { auctionStatus: "ended" } }
        );

        console.log("Auction statuses updated successfully!");
    } catch (error) {
        console.error("Error updating auction statuses:", error.message);
    }
};

// Function to update remaining time of active auctions
export const updateRemainingTime = async () => {
    try {
        const currentDate = new Date();
        const activeAuctions = await Auction.find({ auctionStatus: "active" });

        const updates = activeAuctions.map(async (auction) => {
            const remainingTime = new Date(auction.endDateTime) - currentDate;
            await Auction.findByIdAndUpdate(auction._id, { remainingTime });
            return { ...auction.toObject(), remainingTime };
        });

        const result = await Promise.all(updates);
        console.log("Active Auctions with Updated Remaining Time:", result);
        console.log("Update remaining time function executed!");
    } catch (error) {
        console.log("Error updating remaining time:", error.message);
    }
};

// Function to get all auctions
export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({});
        return res.status(200).json({ auctions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//=====
// In your auction completion logic
const updateUserStats = async (auction) => {
    // Update seller stats
    await User.findByIdAndUpdate(auction.userId, {
      $inc: { successfulCompletedAuctions: 1 }
    });
    
    // Find winning bid and update buyer stats
    const winningBid = await Bid.findOne({ auctionId: auction._id })
      .sort({ bidAmount: -1 })
      .limit(1);
    
    if (winningBid) {
      await User.findByIdAndUpdate(winningBid.userId, {
        $inc: { winningBids: 1 }
      });
    }
  };

  

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


