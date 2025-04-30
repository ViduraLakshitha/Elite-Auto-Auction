import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaBuilding, FaIdCard, FaFileAlt, FaGlobe, FaEnvelope, FaPhone, FaGlobeAmericas } from "react-icons/fa";
import Navbar from "../common/Navbar";

const TransportationForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    registrationNumber: "",
    taxIdentificationNumber: "",
    address: "",
    country: "",
    state: "",
    city: "",
    email: "",
    phoneNumber: "",
    website: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear the specific error when the user starts typing in a field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Company Name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (formData.companyName.trim().length < 3) {
      newErrors.companyName = "Company name must be at least 3 characters";
    } else if (formData.companyName.trim().length > 100) {
      newErrors.companyName = "Company name cannot exceed 100 characters";
    }
    
    // Registration Number validation
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    } else if (!/^[A-Za-z0-9-]{5,20}$/.test(formData.registrationNumber.trim())) {
      newErrors.registrationNumber = "Registration number must be 5-20 alphanumeric characters";
    }
    
    // Tax ID validation
    if (!formData.taxIdentificationNumber.trim()) {
      newErrors.taxIdentificationNumber = "Tax identification number is required";
    } else if (!/^[A-Za-z0-9-]{5,20}$/.test(formData.taxIdentificationNumber.trim())) {
      newErrors.taxIdentificationNumber = "Tax ID must be 5-20 alphanumeric characters";
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address";
    } else if (formData.address.trim().length > 200) {
      newErrors.address = "Address cannot exceed 200 characters";
    }
    
    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    } else if (!/^[A-Za-z\s]{2,56}$/.test(formData.country.trim())) {
      newErrors.country = "Please enter a valid country name";
    }
    
    // State validation (optional field)
    if (formData.state.trim() && !/^[A-Za-z\s]{2,56}$/.test(formData.state.trim())) {
      newErrors.state = "Please enter a valid state/province name";
    }
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (!/^[A-Za-z\s]{2,56}$/.test(formData.city.trim())) {
      newErrors.city = "Please enter a valid city name";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,7}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    
    // Website validation (optional field)
    if (formData.website.trim() && 
        !/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(formData.website.trim())) {
      newErrors.website = "Please enter a valid website URL";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErrors({ general: "Please log in to register your transportation company" });
      setLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:5555/api/transportation/register", formData, {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      setSuccess("Transportation company registered successfully!");
      
      // Reset form after successful submission
      setFormData({
        companyName: "",
        registrationNumber: "",
        taxIdentificationNumber: "",
        address: "",
        country: "",
        state: "",
        city: "",
        email: "",
        phoneNumber: "",
        website: ""
      });
      
      // Reset any errors
      setErrors({});

      // Redirect to home page after short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Error registering transportation company:", err);
      setErrors({ 
        general: err.response?.data?.message || "Error registering transportation company. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-900 via-black to-yellow-900 rounded-3xl shadow-2xl overflow-hidden border border-yellow-600">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-yellow-700 to-yellow-900 p-6 text-center border-b border-yellow-600">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center">
              <FaTruck className="mr-3 text-yellow-300" />
              Register Transportation Company
            </h2>
            <p className="text-yellow-200 mt-2">
              Enter your transportation company details to join our exclusive network
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
            {errors.general && (
              <div className="mb-6 p-4 bg-red-900 border border-red-600 text-red-100 rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="form-group">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    <span className="text-yellow-400">*</span> Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-yellow-600" />
                    </div>
                    <input
                      type="text"
                      name="companyName"
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${errors.companyName ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Elite Transportation Inc."
                    />
                  </div>
                  {errors.companyName && <p className="mt-1 text-red-500 text-xs">{errors.companyName}</p>}
                </div>

                {/* Registration Number */}
                <div className="form-group">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    <span className="text-yellow-400">*</span> Company Registration Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-yellow-600" />
                    </div>
                    <input
                      type="text"
                      name="registrationNumber"
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${errors.registrationNumber ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="e.g. BL1234567890"
                    />
                  </div>
                  {errors.registrationNumber && <p className="mt-1 text-red-500 text-xs">{errors.registrationNumber}</p>}
                </div>

                {/* Tax Identification Number */}
                <div className="form-group">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    <span className="text-yellow-400">*</span> Tax Identification Number (TIN)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaFileAlt className="text-yellow-600" />
                    </div>
                    <input
                      type="text"
                      name="taxIdentificationNumber"
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${errors.taxIdentificationNumber ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                      value={formData.taxIdentificationNumber}
                      onChange={handleChange}
                      placeholder="e.g. TIN1234567890"
                    />
                  </div>
                  {errors.taxIdentificationNumber && <p className="mt-1 text-red-500 text-xs">{errors.taxIdentificationNumber}</p>}
                </div>

                {/* Address */}
                <div className="form-group md:col-span-2">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    <span className="text-yellow-400">*</span> Address (Headquarters or Main Office)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGlobe className="text-yellow-600" />
                    </div>
                    <input
                      type="text"
                      name="address"
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${errors.address ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Transportation Blvd, Suite 456"
                    />
                  </div>
                  {errors.address && <p className="mt-1 text-red-500 text-xs">{errors.address}</p>}
                </div>

                {/* Country */}
                <div className="form-group">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    <span className="text-yellow-400">*</span> Country
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaGlobeAmericas className="text-yellow-600" />
                    </div>
                    <input
                      type="text"
                      name="country"
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${errors.country ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="e.g. United States"
                    />
                  </div>
                  {errors.country && <p className="mt-1 text-red-500 text-xs">{errors.country}</p>}
                </div>

                {/* State */}
                <div className="form-group">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    className={`block w-full pl-3 pr-3 py-2 rounded-lg border ${errors.state ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. California"
                  />
                  {errors.state && <p className="mt-1 text-red-500 text-xs">{errors.state}</p>}
                </div>

                {/* City */}
                <div className="form-group">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    <span className="text-yellow-400">*</span> City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className={`block w-full pl-3 pr-3 py-2 rounded-lg border ${errors.city ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Los Angeles"
                  />
                  {errors.city && <p className="mt-1 text-red-500 text-xs">{errors.city}</p>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    <span className="text-yellow-400">*</span> Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-yellow-600" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@elitetransport.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="form-group">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    <span className="text-yellow-400">*</span> Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-yellow-600" />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${errors.phoneNumber ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phoneNumber && <p className="mt-1 text-red-500 text-xs">{errors.phoneNumber}</p>}
                </div>

                {/* Website */}
                <div className="form-group md:col-span-2">
                  <label className="block text-yellow-400 text-sm font-medium mb-2">
                    Website (if any)
                  </label>
                  <input
                    type="url"
                    name="website"
                    className={`block w-full pl-3 pr-3 py-2 rounded-lg border ${errors.website ? 'border-red-500' : 'border-yellow-600'} bg-black bg-opacity-70 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent`}
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.elitetransport.com"
                  />
                  {errors.website && <p className="mt-1 text-red-500 text-xs">{errors.website}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className={`w-full md:w-auto px-8 py-3 bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 ${
                    loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Register Transportation Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TransportationForm; 