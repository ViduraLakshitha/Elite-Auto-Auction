import Vehicle from '../model/vehicle.js';
import Auction from '../model/auction.js';

export const addVehicle = async (req, res) => {
    try {
        const files = req.files;
        const images = files?.images ? files.images.map(file => file.path) : [];
        const documents = files?.documents ? files.documents.map(file => file.path) : [];

        console.log('Files:', files);
        console.log('Request Body:', req.body);

        // Extract auction-specific fields
        const { initialVehiclePrice, startDateTime, endDateTime, ...vehicleData } = req.body;

        // Create and save the vehicle
        const newVehicle = new Vehicle({
            ...vehicleData,
            images,
            documents,
        });

        const savedVehicle = await newVehicle.save();

        // Create and save the auction (linked to vehicle)
        const newAuction = new Auction({
            vehicleId: savedVehicle._id,
            initialVehiclePrice,
            startDateTime,
            endDateTime,
        });

        await newAuction.save();

        res.status(201).json({ message: 'Vehicle and auction added successfully!', newVehicle, newAuction });
    } catch (error) {
        console.error("Error adding vehicle:", error);
        res.status(500).json({ message: 'Error adding vehicle', error: error.message || error });
    }
};

export const verifyVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, { isVerified: true }, { new: true });

        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle verified successfully', updatedVehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying vehicle', error });
    }
};
//==========================
export const getAllVehicles = async (req, res) => {
    try{
        const vehicles = await Vehicle.find()
        
        return res.status(201).json({vehicles})
    }catch(error){
        return res.status(500).json({ message: error.message });
    }
}