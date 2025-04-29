import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const validateForm = () => {
    if (!vehicleData.brand) return "Brand is required";
    if (!vehicleData.model) return "Model is required";
    if (!vehicleData.year) return "Year is required";
    if (!vehicleData.currentLocation) return "Current location is required";
    if (!vehicleData.vehicleType) return "Vehicle type is required";
    if (!vehicleData.condition) return "Condition is required";
    if (!vehicleData.description) return "Description is required";
    if (!vehicleData.initialVehiclePrice || parseFloat(vehicleData.initialVehiclePrice) <= 0) {
      return "Starting bid price must be a positive value";
    }
    if (!vehicleData.images || vehicleData.images.length === 0) {
      return "At least one image is required";
    }
    if (!vehicleData.documents || vehicleData.documents.length === 0) {
      return "At least one document is required";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to register a vehicle");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(vehicleData).forEach(([key, value]) => {
        if (key === "images" || key === "documents") {
          if (value && value.length > 0) {
            Array.from(value).forEach((file) => formData.append(key, file));
          }
        } else {
          formData.append(key, value);
        }
      });

      const response = await axios.post("http://localhost:5555/api/vehicles/add", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });

      setSuccess("Vehicle registered successfully!");
      setError("");
      
      // Navigate to payment page after successful registration
      navigate("/payment");
      
      // Clear form after successful submission
      setVehicleData({
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

    } catch (err) {
      console.error("Error submitting vehicle:", err);
      if (err.response) {
        console.error("Server response:", err.response.data);
        const errorMessage = err.response.data.message || 
                           err.response.data.error || 
                           "Error submitting vehicle. Please try again.";
        setError(errorMessage);
      } else if (err.request) {
        setError("Network error: Could not connect to the server.");
      } else {
        setError(err.message || "Error submitting vehicle. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Register Vehicle</h2>
        
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p className="text-center font-semibold">{success}</p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="text-center">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" 
            name="brand" 
            placeholder="Brand" 
            className="input-field" 
            value={vehicleData.brand} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="model" 
            placeholder="Model" 
            className="input-field" 
            value={vehicleData.model} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="number" 
            name="year" 
            placeholder="Year" 
            className="input-field" 
            value={vehicleData.year} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="currentLocation" 
            placeholder="Current Location" 
            className="input-field" 
            value={vehicleData.currentLocation} 
            onChange={handleChange} 
            required 
          />

          <select 
            name="vehicleType" 
            className="input-field" 
            value={vehicleData.vehicleType} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Vehicle Type</option>
            <option value="Luxury">Luxury</option>
            <option value="Classic">Classic</option>
          </select>

          <select 
            name="condition" 
            className="input-field" 
            value={vehicleData.condition} 
            onChange={handleChange} 
            required
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Salvage">Salvage</option>
          </select>

          <input 
            type="number" 
            name="initialVehiclePrice" 
            placeholder="Starting Bid Price" 
            className="input-field" 
            value={vehicleData.initialVehiclePrice} 
            onChange={handleChange} 
            min="1" 
            required 
          />
        </div>

        <label className="block mt-4">Starting Auction Time (Optional)</label>
        <input 
          type="datetime-local" 
          name="startDateTime" 
          className="input-field" 
          value={vehicleData.startDateTime} 
          onChange={handleChange} 
        />
        
        <label className="block mt-4">Ending Auction Time (Optional)</label>
        <input 
          type="datetime-local" 
          name="endDateTime" 
          className="input-field" 
          value={vehicleData.endDateTime} 
          onChange={handleChange} 
        />

        <textarea 
          name="description" 
          placeholder="Description" 
          className="input-field mt-4" 
          value={vehicleData.description} 
          onChange={handleChange} 
          required
        ></textarea>

        <div className="file-input-group mt-4">
          <label htmlFor="images" className="block mb-2">Upload Images</label>
          <input 
            type="file" 
            id="images" 
            name="images" 
            multiple 
            className="file-input" 
            onChange={handleFileChange} 
            required 
          />
        </div>

        <div className="file-input-group mt-4">
          <label htmlFor="documents" className="block mb-2">Upload Documents</label>
          <input 
            type="file" 
            id="documents" 
            name="documents" 
            multiple 
            className="file-input" 
            onChange={handleFileChange} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="submit-button mt-6 w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;
