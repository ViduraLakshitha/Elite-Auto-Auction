import Vehicle from '../model/vehicle.js';  // Corrected import path

export const addVehicle = async (req, res) => {
    try {
      const files = req.files;
      const images = files && files.images ? files.images.map(file => file.path) : [];
      const documents = files && files.documents ? files.documents.map(file => file.path) : [];
  
      // Log the files and req.body to check if they are coming correctly
      console.log('Files:', files);
      console.log('Request Body:', req.body);
  
      const newVehicle = new Vehicle({
        ...req.body,
        images,
        documents,
      });
  
      await newVehicle.save();
  
      res.status(201).json({ message: 'Vehicle added successfully!', newVehicle });
    } catch (error) {
      // Log the error to console for better debugging
      console.error("Error adding vehicle:", error);
  
      // Return the error message in the response for more details
      res.status(500).json({ message: 'Error adding vehicle', error: error.message || error });
    }
  };

export const verifyVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, { isVerified: true }, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle verified successfully', updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying vehicle', error });
  }
};
