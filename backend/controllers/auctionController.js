import {Auction} from '../model/auction.js';
import { io } from "../index.js";  // Import Socket.IO instance

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
