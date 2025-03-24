import {Auction} from '../model/auction.js';
import { io } from "../index.js";  // Import Socket.IO instance
import { UserInteractions } from '../model/userInteractions.js';
import { Vehicle } from '../model/vehicle.js';

export const createAuction = async (req, res) => {
    try {
        if (
            !req.body.userId||
            !req.body.vehicleId||
            !req.body.auctionTitle||
            //!req.body.startDateTime ||
            !req.body.endDateTime ||
            !req.body.initialVehiclePrice
        ) {
            return res.status(400).send({message: "send all required fields!"});
        }

        const newAuction = {
            userId:req.body.userId,
            vehicleId:req.body.vehicleId,
            auctionTitle:req.body.auctionTitle,
            startDateTime: req.body.startDateTime,
            endDateTime: req.body.endDateTime,
            initialVehiclePrice: req.body.initialVehiclePrice,
        };

        const auction = await Auction.create(newAuction);
        console.log("New auction created:", auction);

        if(!auction.startDateTime){
            auction.auctionStatus="active";
            await auction.save();
        }

        //io.emit("newAuctionCreated", auction);
        
        console.log("auctionCreated event emitted");
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
        
        //console.log("Auction statuses updated successfully!");
    } catch (error) {
        console.error("Error updating auction statuses:", error.message);
    }
};

export const getAllAuctions = async (req, res) => {
    try{
        const auctions = await Auction.find({auctionStatus:"active"});
        return res.status(201).json({auctions})
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}

export const getAuctionById = async (req, res) => {
    try {
        const { id } = req.params; // Get the auction ID from URL parameters
        const auction = await Auction.findById(id);//.populate("userId vehicleId"); // Populate related data if needed

        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        return res.status(200).json(auction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Track user interactions when clicking an auction card
export const trackUserClick = async (req, res) => {
    try {
        const { userId, vehicleId } = req.body;

        // Fetch the vehicle to get its brand
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        const vehicleBrand = vehicle.brand;

        // Find existing interaction record
        let interaction = await UserInteractions.findOne({ userId, brand: vehicleBrand });

        if (!interaction) {
            // Create new record if it doesn't exist
            interaction = new UserInteractions({ userId, brand: vehicleBrand, count: 1 });
        } else {
            // Increment count and update timestamp
            interaction.count += 1;
        }

        await interaction.save();
        return res.status(200).json({ message: "Click tracked successfully", interaction });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getRecommendedAuctions = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get user's top-clicked brands (threshold: count >= 5, within last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const topBrands = await UserInteractions.find({
            userId,
            count: { $gte: 5 },  // Only consider brands clicked at least 5 times
            updatedAt: { $gte: sevenDaysAgo }  // Filter recent interactions
        }).sort({ count: -1 });

        if (topBrands.length === 0) {
            return res.status(200).json({ message: "No recommendations found" });
        }

        // Fetch vehicle auctions for top-clicked brands
        const brands = topBrands.map(b => b.brand);
        const recommendedAuctions = await Auction.find({ auctionStatus: "active" })
            .populate({
                path: 'vehicleId',
                match: { brand: { $in: brands } }
            });

        return res.status(200).json({ recommendedAuctions });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
