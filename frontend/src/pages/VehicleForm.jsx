import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCar, FaFileUpload, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";

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
    if (name === "initialVehiclePrice" && (value === "" || parseFloat(value) < 0)) return;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setVehicleData({ ...vehicleData, [name]: files });
  };

  const validateForm = () => {
    const requiredFields = [
      { field: "brand", message: "Brand is required" },
      { field: "model", message: "Model is required" },
      { field: "year", message: "Year is required" },
      { field: "currentLocation", message: "Current location is required" },
      { field: "vehicleType", message: "Vehicle type is required" },
      { field: "condition", message: "Condition is required" },
      { field: "description", message: "Description is required" },
    ];

    for (const { field, message } of requiredFields) {
      if (!vehicleData[field]) return message;
    }

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

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

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

      await axios.post("http://localhost:5555/api/vehicles/add", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });

      setSuccess("Vehicle registered successfully!");
      navigate("/payment");
      
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
      setError(err.response?.data?.message || "Error submitting vehicle. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-900 via-black to-yellow-900 rounded-3xl shadow-2xl overflow-hidden border border-yellow-600">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-yellow-700 to-yellow-900 p-6 text-center border-b border-yellow-600">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center">
              <FaCar className="mr-3 text-yellow-300" />
              Register Your Luxury Vehicle
            </h2>
            <p className="text-yellow-200 mt-2">
              Enter your vehicle details to join our exclusive auction
            </p>
          </div>

          {/* Form Body */}
          <div className="p-8 bg-black bg-opacity-70">
            {/* Status Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-900 border border-green-600 text-green-100 rounded-lg">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-900 border border-red-600 text-red-100 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Brand */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="text-yellow-400">*</span> Brand
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="brand"
                      className="form-input"
                      value={vehicleData.brand}
                      onChange={handleChange}
                      placeholder="e.g. Rolls Royce"
                    />
                  </div>
                </div>

                {/* Model */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="text-yellow-400">*</span> Model
                  </label>
                  <input
                    type="text"
                    name="model"
                    className="form-input"
                    value={vehicleData.model}
                    onChange={handleChange}
                    placeholder="e.g. Phantom"
                  />
                </div>

                {/* Year */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="text-yellow-400">*</span> Year
                  </label>
                  <input
                    type="number"
                    name="year"
                    className="form-input"
                    value={vehicleData.year}
                    onChange={handleChange}
                    placeholder="e.g. 2023"
                  />
                </div>

                {/* Location */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="text-yellow-400">*</span> Current Location
                  </label>
                  <input
                    type="text"
                    name="currentLocation"
                    className="form-input"
                    value={vehicleData.currentLocation}
                    onChange={handleChange}
                    placeholder="e.g. Dubai, UAE"
                  />
                </div>

                {/* Vehicle Type */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="text-yellow-400">*</span> Vehicle Type
                  </label>
                  <select
                    name="vehicleType"
                    className="form-input"
                    value={vehicleData.vehicleType}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Luxury">Luxury Vehicle</option>
                    <option value="Classic">Classic Car</option>
                    {/* <option value="Supercar">Supercar</option>
                    <option value="Hypercar">Hypercar</option> */}
                  </select>
                </div>

                {/* Condition */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="text-yellow-400">*</span> Condition
                  </label>
                  <select
                    name="condition"
                    className="form-input"
                    value={vehicleData.condition}
                    onChange={handleChange}
                  >
                    <option value="">Select Condition</option>
                    <option value="New">New (0 miles)</option>
                    <option value="Used">Used (Excellent)</option>
                    {/* <option value="Restored">Fully Restored</option>
                    <option value="Original">Original Condition</option> */}
                  </select>
                </div>

                {/* Starting Price */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <span className="text-yellow-400">*</span> Starting Bid Price
                    <FaMoneyBillWave className="ml-2 text-yellow-400" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400">$</span>
                    <input
                      type="number"
                      name="initialVehiclePrice"
                      className="form-input pl-8"
                      value={vehicleData.initialVehiclePrice}
                      onChange={handleChange}
                      placeholder="e.g. 250000"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Auction Times */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    Auction Start Time <FaCalendarAlt className="ml-2 text-yellow-400" />
                  </label>
                  <input
                    type="datetime-local"
                    name="startDateTime"
                    className="form-input"
                    value={vehicleData.startDateTime}
                    onChange={handleChange}
                  />
                </div>

                {/* End Time */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    Auction End Time <FaCalendarAlt className="ml-2 text-yellow-400" />
                  </label>
                  <input
                    type="datetime-local"
                    name="endDateTime"
                    className="form-input"
                    value={vehicleData.endDateTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label flex items-center">
                  <span className="text-yellow-400">*</span> Description
                  <FaInfoCircle className="ml-2 text-yellow-400" />
                </label>
                <textarea
                  name="description"
                  className="form-input h-32"
                  value={vehicleData.description}
                  onChange={handleChange}
                  placeholder="Describe your vehicle's features, history, and any special details..."
                ></textarea>
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Images */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <span className="text-yellow-400">*</span> Vehicle Images
                    <FaFileUpload className="ml-2 text-yellow-400" />
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      name="images"
                      multiple
                      className="file-upload-input"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <div className="file-upload-display">
                      {vehicleData.images && vehicleData.images.length > 0 ? (
                        <span className="text-yellow-300">
                          {vehicleData.images.length} image(s) selected
                        </span>
                      ) : (
                        <span className="text-gray-400">Click to browse or drag files</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="form-group">
                  <label className="form-label flex items-center">
                    <span className="text-yellow-400">*</span> Vehicle Documents
                    <FaFileUpload className="ml-2 text-yellow-400" />
                  </label>
                  <div className="file-upload-wrapper">
                    <input
                      type="file"
                      name="documents"
                      multiple
                      className="file-upload-input"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    <div className="file-upload-display">
                      {vehicleData.documents && vehicleData.documents.length > 0 ? (
                        <span className="text-yellow-300">
                          {vehicleData.documents.length} document(s) selected
                        </span>
                      ) : (
                        <span className="text-gray-400">Click to browse or drag files</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className={`w-full py-3 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                    loading
                      ? "bg-yellow-800 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900"
                  } text-white shadow-lg border border-yellow-600 flex items-center justify-center`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "REGISTER VEHICLE FOR AUCTION"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .form-group {
          margin-bottom: 0;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #e2e8f0;
          font-weight: 500;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: rgba(17, 24, 39, 0.7);
          border: 1px solid #4b5563;
          border-radius: 0.5rem;
          color: #f3f4f6;
          transition: all 0.3s;
        }
        .form-input:focus {
          outline: none;
          border-color: #d97706;
          box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
          background-color: rgba(17, 24, 39, 0.9);
        }
        .file-upload-wrapper {
          position: relative;
          margin-bottom: 1rem;
        }
        .file-upload-input {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        .file-upload-display {
          padding: 0.75rem 1rem;
          background-color: rgba(17, 24, 39, 0.7);
          border: 1px dashed #4b5563;
          border-radius: 0.5rem;
          text-align: center;
          transition: all 0.3s;
        }
        .file-upload-wrapper:hover .file-upload-display {
          border-color: #d97706;
          background-color: rgba(17, 24, 39, 0.9);
        }
      `}</style>
    </div>
  );
};

export default VehicleForm;