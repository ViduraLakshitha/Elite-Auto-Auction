import express from 'express';
import {Auction} from '../model/auction.js';

const router = express.Router();

//route for save a new auction
router.post('/register', async (req,res) => {
    try {
        if(
            !req.body.userId||
            !req.body.vehicleId||
            !req.body.startDateTime ||
            !req.body.endDateTime ||
            !req.body.initialVehiclePrice
        ){
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

        return res.status(201).send(auction);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
        
    }
})

export default router;