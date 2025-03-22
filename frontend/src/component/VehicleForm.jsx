import React, { useState } from "react";
import axios from "axios"; // Import Axios

const VehicleForm = () => {
  const [vehicleData, setVehicleData] = useState({
    brand: "",
    model: "",
    year: "",
    currentLocation: "",
    vehicleType: "",
    condition: "",
    description: "",
    initialVehiclePrice: "",
    startDateTime: "",
    endDateTime: "",
    images: null,
    documents: null,
  });

  const [error, setError] = useState(""); // State for error messages
  const [success, setSuccess] = useState(""); // State for success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "initialVehiclePrice" && (value === "" || parseFloat(value) < 0)) {
      return;
    }
    
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setVehicleData({ ...vehicleData, [name]: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!vehicleData.initialVehiclePrice || parseFloat(vehicleData.initialVehiclePrice) <= 0) {
      setError("Starting bid price must be a positive value!");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(vehicleData).forEach((key) => {
        if (key === "images" || key === "documents") {
          if (vehicleData[key] && vehicleData[key].length > 0) {
            for (let i = 0; i < vehicleData[key].length; i++) {
              formData.append(key, vehicleData[key][i]);
            }
          } else {
            setError(`Please upload at least one ${key}.`);
            return;
          }
        } else {
          formData.append(key, vehicleData[key]);
        }
      });

      const response = await axios.post("http://localhost:5000/api/vehicles/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Vehicle registered successfully!");
      setError("");
      console.log("Vehicle added:", response.data);
    } catch (err) {
      console.error("Error submitting vehicle:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Error submitting vehicle. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Register Vehicle</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}

        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="brand" placeholder="Brand" className="input-field" value={vehicleData.brand} onChange={handleChange} required />
          <input type="text" name="model" placeholder="Model" className="input-field" value={vehicleData.model} onChange={handleChange} required />
          <input type="number" name="year" placeholder="Year" className="input-field" value={vehicleData.year} onChange={handleChange} required />
          <input type="text" name="currentLocation" placeholder="Current Location" className="input-field" value={vehicleData.currentLocation} onChange={handleChange} required />

          <select name="vehicleType" className="input-field" value={vehicleData.vehicleType} onChange={handleChange} required>
            <option value="">Select Vehicle Type</option>
            <option value="Luxury">Luxury</option>
            <option value="Classic">Classic</option>
            
          </select>

          <select name="condition" className="input-field" value={vehicleData.condition} onChange={handleChange} required>
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Salvage">Salvage</option>
          </select>

          <input type="number" name="initialVehiclePrice" placeholder="Starting Bid Price" className="input-field" value={vehicleData.initialVehiclePrice} onChange={handleChange} min="1" required />
        </div>

        <label className="block mt-4">Starting Auction Time (Optional)</label>
        <input type="datetime-local" name="startDateTime" className="input-field" value={vehicleData.startDateTime} onChange={handleChange} />
        
        <label className="block mt-4">Ending Auction Time (Optional)</label>
        <input type="datetime-local" name="endDateTime" className="input-field" value={vehicleData.endDateTime} onChange={handleChange} />

        <textarea name="description" placeholder="Description" className="input-field mt-4" value={vehicleData.description} onChange={handleChange} required></textarea>

        <div className="file-input-group">
          <label htmlFor="images">Upload Images</label>
          <input type="file" id="images" name="images" multiple className="file-input" onChange={handleFileChange} required />
        </div>

        <div className="file-input-group">
          <label htmlFor="documents">Upload Documents</label>
          <input type="file" id="documents" name="documents" multiple className="file-input" onChange={handleFileChange} required />
        </div>

        <button type="submit" className="submit-button">Register Vehicle</button>
      </form>
    </div>
  );
};

export default VehicleForm;
