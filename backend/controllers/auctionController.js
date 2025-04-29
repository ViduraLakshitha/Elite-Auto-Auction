import { Auction } from '../model/auction.js';
import { Notification } from '../model/Notification.js';
import { io } from "../index.js";  // Socket.io for real-time if needed
import { Vehicle } from '../model/vehicle.js';

export const createAuction = async (req, res) => {
    try {
        if (
            !req.body.userId ||
            !req.body.vehicleId ||
            !req.body.auctionTitle ||
            !req.body.endDateTime ||
            !req.body.initialVehiclePrice
        ) {
            return res.status(400).send({ message: "Send all required fields!" });
        }

        if (!req.body.userId) {
            return res.status(400).json({ message: 'userId is required to create an auction.' });
          }
          
          const newAuction = {
            userId: req.body.userId,
            vehicleId: req.body.vehicleId,
            auctionTitle: req.body.auctionTitle,
            startDateTime: req.body.startDateTime || null,
            endDateTime: req.body.endDateTime,
            initialVehiclePrice: req.body.initialVehiclePrice,
            auctionStatus: req.body.startDateTime ? 'scheduled' : 'active'
          };
          

        const auction = await Auction.create(newAuction);
        console.log("New auction created:", auction);

        // Notification for new auction created
        const notification = await Notification.create({
            userId: req.body.userId,
            message: `A new auction "${req.body.auctionTitle}" has been created.`,
            type: 'new_auction'
        });

        // Emit real-time notification to the client
        io.emit("newAuctionCreated", { auction, notification });

        return res.status(201).json({ message: 'Auction Created Successfully', auction });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Update auction statuses and send notifications
export const updateAuctionStatuses = async () => {
    try {
        const currentDate = new Date();
        const localOffset = currentDate.getTimezoneOffset() * 60000;
        const localDate = new Date(currentDate.getTime() - localOffset);

        const scheduledAuctions = await Auction.find({ 
            startDateTime: { $gt: localDate },
            userId: { $exists: true, $ne: null }
        });

        const activeAuctions = await Auction.find({ 
            startDateTime: { $lte: localDate }, 
            endDateTime: { $gt: localDate },
            userId: { $exists: true, $ne: null }
        });

        const endedAuctions = await Auction.find({ 
            endDateTime: { $lte: localDate },
            userId: { $exists: true, $ne: null }
        });

        await Auction.updateMany(
            { startDateTime: { $gt: localDate }, userId: { $exists: true, $ne: null } },
            { $set: { auctionStatus: "scheduled" } }
        );

        await Auction.updateMany(
            { startDateTime: { $lte: localDate }, endDateTime: { $gt: localDate }, userId: { $exists: true, $ne: null } },
            { $set: { auctionStatus: "active" } }
        );

        await Auction.updateMany(
            { endDateTime: { $lte: localDate }, userId: { $exists: true, $ne: null } },
            { $set: { auctionStatus: "ended" } }
        );

        console.log(`🔵 Scheduled Auctions: ${scheduledAuctions.length}`);
        console.log(`🟢 Active Auctions: ${activeAuctions.length}`);
        console.log(`🔴 Ended Auctions: ${endedAuctions.length}`);

        // Send notifications for scheduled auctions (if needed)
        for (let auction of scheduledAuctions) {
            console.log('Processing scheduled auction:', auction._id, auction.auctionTitle);

            const notification = await Notification.create({
                userId: auction.userId,
                message: `Your auction "${auction.auctionTitle}" is scheduled to start soon.`,
                type: 'scheduled'
            });

            io.emit("auctionStatusUpdated", { auction, notification });
        }

        // 🔥 Only send live notification if NOT already sent
        for (let auction of activeAuctions) {
            console.log('Processing active auction:', auction._id, auction.auctionTitle);

            // Check if already notified
            if (!auction.notifiedLive) {
                const notification = await Notification.create({
                    userId: auction.userId,
                    message: `Your auction "${auction.auctionTitle}" is now live!`,
                    type: 'live'
                });

                io.emit("auctionStatusUpdated", { auction, notification });

                // Update the auction to mark it as notified
                auction.notifiedLive = true;
                await auction.save();
                console.log(`🔔 Sent live notification for auction ${auction._id}`);
            } else {
                console.log(`⏩ Already notified for auction ${auction._id}`);
            }
        }

        console.log(`✅ Auction statuses updated successfully.`);
    } catch (error) {
        console.error("❌ Error updating auction statuses:", error.message);
    }
};



// Notify ending soon auctions
export const notifyEndingSoonAuctions = async () => {
    try {
        const currentDate = new Date();
        const timeLimit = new Date(currentDate.getTime() + 10 * 60 * 1000); // 10 minutes

        const endingSoonAuctions = await Auction.find({ 
            auctionStatus: "active", 
            endDateTime: { $lte: timeLimit, $gt: currentDate }
        });

        for (let auction of endingSoonAuctions) {
            const notification = await Notification.create({
                userId: auction.userId,
                message: `⏳ Hurry! Auction "${auction.auctionTitle}" is ending soon.`,
                type: 'ending_soon'
            });

            // Emit real-time notification to the client
            io.emit("auctionEndingSoon", { auction, notification });
        }

        console.log(`✅ Sent ending soon notifications for ${endingSoonAuctions.length} auctions`);
    } catch (error) {
        console.error("Error sending ending soon notifications:", error.message);
    }
};

// Fetch notifications by user
export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({ notifications });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({auctionStatus:"active"})
        .populate({
            path:'vehicleId',
        })
        .exec(); 
        return res.status(201).json({auctions});
    } catch(error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAuctionById = async (req, res) => {
    try {
        const { id } = req.params;
        const auction = await Auction.findById(id)
        .populate({
            path:'vehicleId',
        })
        .exec();

        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        return res.status(200).json(auction);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
