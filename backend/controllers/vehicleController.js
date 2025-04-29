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
    console.log('User from auth:', req.user); // Debug log

    const { initialVehiclePrice, startDateTime, endDateTime, ...vehicleData } = req.body;

    // Get userId from the authenticated user
    const userId = req.user.userId; // Changed from req.user.id to req.user.userId

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Now include user ID automatically
    const newVehicle = new Vehicle({
      ...vehicleData,
      images,
      documents,
      userId: userId,
    });

    const savedVehicle = await newVehicle.save();

    // Create auction with all required fields
    const newAuction = new Auction({
      vehicleId: savedVehicle._id,
      userId: userId, // Add userId to auction
      auctionTitle: `${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}`, // Create title from vehicle details
      initialVehiclePrice,
      startDateTime: startDateTime || new Date(), // Use provided date or current date
      endDateTime: endDateTime || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 7 days from now if not provided
      status: 'pending', // Set initial status
      currentPrice: initialVehiclePrice, // Set initial price
      description: vehicleData.description, // Use vehicle description
      isActive: true, // Set as active
      isVerified: false, // Set as unverified initially
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
