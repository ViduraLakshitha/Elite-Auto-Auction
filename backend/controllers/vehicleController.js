// vehicleController.js
import Vehicle from '../model/vehicle.js';
import Auction from '../model/auction.js';

// Add Vehicle
const addVehicle = async (req, res) => {
  try {
    const files = req.files;
    const images = files?.images ? files.images.map(file => file.path) : [];
    const documents = files?.documents ? files.documents.map(file => file.path) : [];

    console.log('Files:', files);
    console.log('Request Body:', req.body);

    const { initialVehiclePrice, startDateTime, endDateTime, ...vehicleData } = req.body;

    // Now include user ID automatically
    const newVehicle = new Vehicle({
      ...vehicleData,
      images,
      documents,
      userId: req.user.id, // <==== Important: takes from auth middleware
    });

    const savedVehicle = await newVehicle.save();

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
    res.status(500).json({ 
      message: 'Error adding vehicle', 
      error: error.message || error,
      fullError: error // <-- Add full error in the response temporarily
    });
  }
};

// Verify Vehicle
const verifyVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.vehicleId;
    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, { isVerified: true }, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle verified successfully', updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying vehicle', error: error.message });
  }
};

// Get All Vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ vehicles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export them at once
export { addVehicle, verifyVehicle, getAllVehicles };
