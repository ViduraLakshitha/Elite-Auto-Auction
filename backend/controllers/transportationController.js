import Transportation from '../model/transportation.js';

// Register Transportation Company
const registerTransportation = async (req, res) => {
  try {
    const { 
      companyName, 
      registrationNumber, 
      taxIdentificationNumber, 
      address, 
      country, 
      state, 
      city, 
      email, 
      phoneNumber, 
      website 
    } = req.body;

    // Get userId from the authenticated user
    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found in token' });
    }

    // Check if a company with this registration number already exists
    const existingCompany = await Transportation.findOne({ registrationNumber });
    if (existingCompany) {
      return res.status(400).json({ message: 'A company with this registration number already exists' });
    }

    // Create new transportation company
    const newTransportation = new Transportation({
      userId,
      companyName, 
      registrationNumber, 
      taxIdentificationNumber, 
      address, 
      country, 
      state, 
      city, 
      email, 
      phoneNumber, 
      website
    });

    const savedTransportation = await newTransportation.save();

    res.status(201).json({ 
      message: 'Transportation company registered successfully!', 
      transportation: savedTransportation 
    });
  } catch (error) {
    console.error("Error registering transportation company:", error);
    res.status(500).json({ 
      message: 'Error registering transportation company', 
      error: error.message || error
    });
  }
};

// Get transportation companies by user
const getTransportationByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const transportationCompanies = await Transportation.find({ userId });
    
    res.status(200).json({ transportationCompanies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transportation companies', error: error.message });
  }
};

// Get all transportation companies (for admin)
const getAllTransportation = async (req, res) => {
  try {
    const transportationCompanies = await Transportation.find();
    res.status(200).json({ transportationCompanies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transportation companies', error: error.message });
  }
};

// Verify transportation company
const verifyTransportation = async (req, res) => {
  try {
    const transportationId = req.params.transportationId;
    const updatedTransportation = await Transportation.findByIdAndUpdate(
      transportationId, 
      { isVerified: true }, 
      { new: true }
    );

    if (!updatedTransportation) {
      return res.status(404).json({ message: 'Transportation company not found' });
    }

    res.status(200).json({ 
      message: 'Transportation company verified successfully', 
      transportation: updatedTransportation 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error verifying transportation company', 
      error: error.message 
    });
  }
};

// Update transportation company
const updateTransportation = async (req, res) => {
  try {
    const transportationId = req.params.transportationId;
    
    // Get data to update
    const { 
      companyName, 
      registrationNumber, 
      taxIdentificationNumber, 
      address, 
      country, 
      state, 
      city, 
      email, 
      phoneNumber, 
      website 
    } = req.body;

    // Check if company exists
    const existingCompany = await Transportation.findById(transportationId);
    if (!existingCompany) {
      return res.status(404).json({ message: 'Transportation company not found' });
    }

    // Check if updating to an existing registration number (if changing reg number)
    if (
      registrationNumber !== existingCompany.registrationNumber &&
      await Transportation.findOne({ registrationNumber })
    ) {
      return res.status(400).json({ 
        message: 'A company with this registration number already exists' 
      });
    }

    // Update company data
    const updatedTransportation = await Transportation.findByIdAndUpdate(
      transportationId,
      { 
        companyName, 
        registrationNumber, 
        taxIdentificationNumber, 
        address, 
        country, 
        state, 
        city, 
        email, 
        phoneNumber, 
        website 
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Transportation company updated successfully',
      transportation: updatedTransportation
    });
  } catch (error) {
    console.error("Error updating transportation company:", error);
    res.status(500).json({
      message: 'Error updating transportation company',
      error: error.message || error
    });
  }
};

// Delete transportation company
const deleteTransportation = async (req, res) => {
  try {
    const transportationId = req.params.transportationId;
    
    const deletedTransportation = await Transportation.findByIdAndDelete(transportationId);
    
    if (!deletedTransportation) {
      return res.status(404).json({ message: 'Transportation company not found' });
    }
    
    res.status(200).json({ 
      message: 'Transportation company deleted successfully',
      transportation: deletedTransportation
    });
  } catch (error) {
    console.error("Error deleting transportation company:", error);
    res.status(500).json({
      message: 'Error deleting transportation company',
      error: error.message || error
    });
  }
};

export { 
  registerTransportation, 
  getTransportationByUser, 
  getAllTransportation,
  verifyTransportation,
  updateTransportation,
  deleteTransportation
}; 