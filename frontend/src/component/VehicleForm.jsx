import React, { useState } from "react";

const VehicleForm = () => {
  const [vehicleData, setVehicleData] = useState({
    brand: "",
    model: "",
    year: "",
    currentLocation: "",
    vehicleType: "",
    condition: "",
    description: "",
    startingBidPrice: "",
    images: null,
    documents: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "startingBidPrice") {
      // Ensure that startingBidPrice is always positive
      if (value === "" || parseFloat(value) < 0) {
        return;
      }
    }

    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setVehicleData({ ...vehicleData, [name]: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (vehicleData.startingBidPrice === "" || parseFloat(vehicleData.startingBidPrice) <= 0) {
      alert("Starting bidding price must be a positive value!");
      return;
    }

    console.log("Vehicle Data Submitted:", vehicleData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Register Vehicle</h2>

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
            <option value="Sedan">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Truck">Truck</option>
            <option value="Coupe">Coupe</option>
            <option value="Convertible">Convertible</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Classic">Classic</option>
            <option value="Other">Other</option>
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
            name="startingBidPrice"
            placeholder="Starting Bid Price"
            className="input-field"
            value={vehicleData.startingBidPrice}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          className="input-field mt-4"
          value={vehicleData.description}
          onChange={handleChange}
          required
        ></textarea>

        {/* File Inputs Section */}
        <div className="file-input-group">
          <label htmlFor="images">Upload Images</label>
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

        <div className="file-input-group">
          <label htmlFor="documents">Upload Documents</label>
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

        <button type="submit" className="submit-button">
          Register Vehicle
        </button>
      </form>
    </div>
  );
};

export default VehicleForm;
