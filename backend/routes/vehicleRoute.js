import express from 'express';
import { Vehicle } from '../model/vehicle.js';

const router = express.Router();

//route for save a new vehicle
router.post('/register', async (req,res) => {
    try {
        if(
            !req.body.userId||
            !req.body.brand ||
            !req.body.model ||
            !req.body.year||
            !req.body.currentLocation||
            !req.body.vehicleType||
            !req.body.condition||
            !req.body.description||
            !req.body.images||
            !req.body.documents
        ){
            return res.status(400).send({message: "send all required fields!"});
        }
        
        const newVehicle = {
            userId:req.body.userId,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            currentLocation: req.body.currentLocation,
            vehicleType: req.body.vehicleType,
            condition: req.body.condition,
            description: req.body.description,
            images: req.body.images,
            documents: req.body.documents,
        };

        const vehicle = await Vehicle.create(newVehicle);

        return res.status(201).send(vehicle);
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({message: error.message});
        
    }
})

export default router;