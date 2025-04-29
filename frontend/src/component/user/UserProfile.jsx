import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    address: "",
    country: "",
    mobileNo: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
          console.error("Authentication required");
          navigate("/login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get(`http://localhost:5555/user/${userId}`, config);

        if (response.data) {
          setUser(response.data);
          setFormData({
            fname: response.data.fname || "",
            lname: response.data.lname || "",
            email: response.data.email || "",
            address: response.data.address || "",
            country: response.data.country || "",
            mobileNo: response.data.mobileNo || "",
          });
  
          // Fetch payment history
          const paymentResponse = await axios.get(
            `http://localhost:5555/user/${userId}/payments`, 
            config
          );
          setPaymentHistory(paymentResponse.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDetails();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fname.trim()) newErrors.fname = "First name is required";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!/^\+?\d{10,15}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Enter valid Mobile No (10-15 digits with optional +)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.put(
        `http://localhost:5555/user/${user._id}`, 
        formData, 
        config
      );
      setUser(response.data);
      setShowDetails(true);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-b-gray-300 border-l-gray-300 border-r-gray-300 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 font-serif">
            Loading your premium profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="container mx-auto px-6 py-16 flex-grow flex items-center justify-center">
          <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-sm border border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-serif">Exclusive Access Required</h3>
            <div className="h-1 w-16 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-gray-600 mb-8">
              Please authenticate to access your premium account.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-8 rounded transition duration-300"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
      <div className="container mx-auto px-6 py-16 flex-grow">
        {/* Profile Header */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6 font-serif tracking-tight">
            {user.fname}'s Profile
          </h1>
          <div className="h-1 w-24 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-lg text-gray-300">
            Elite Auto Auctions Member Since {new Date(user.createdAt).getFullYear()}
          </p>
        </div>

        {/* Profile Navigation */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setShowDetails(true)}
              className={`px-8 py-3 text-sm font-medium rounded-l-lg ${
                showDetails
                  ? "bg-amber-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Profile Overview
            </button>
            <button
              onClick={() => setShowDetails(false)}
              className={`px-8 py-3 text-sm font-medium rounded-r-lg ${
                !showDetails
                  ? "bg-amber-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto">
          {showDetails ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Personal Information</h2>
                <div className="h-1 w-16 bg-amber-500 mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoBlock label="First Name" value={user.fname} icon="user" />
                  <InfoBlock label="Last Name" value={user.lname} icon="user" />
                  <InfoBlock label="Email" value={user.email} icon="envelope" />
                  <InfoBlock label="Mobile No" value={user.mobileNo} icon="phone" />
                  <InfoBlock label="Address" value={user.address} icon="map-marker" />
                  <InfoBlock label="Country" value={user.country} icon="globe" />
                </div>
              </div>

              {/* Payment History Section */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Bidding & Payment History</h2>
                <div className="h-1 w-16 bg-amber-500 mb-6"></div>
                
                {paymentHistory.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Auction ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vehicle
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paymentHistory.map((payment) => (
                          <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.auctionId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.vehicleName || "Classic Car"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              ${payment.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(payment.date).toLocaleDateString("en-US", { 
                                year: "numeric", 
                                month: "short", 
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  payment.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : payment.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-lg text-center">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h5 className="mt-4 text-lg font-medium text-gray-700">
                      No Bidding History Yet
                    </h5>
                    <p className="mt-2 text-gray-500">
                      Your future vehicle acquisitions will appear here
                    </p>
                    <button
                      onClick={() => navigate("/auctions")}
                      className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-6 rounded transition duration-300"
                    >
                      Browse Exclusive Auctions
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-100 max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Edit Profile</h2>
              <div className="h-1 w-16 bg-amber-500 mb-8"></div>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <InputField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    icon="envelope"
                  />
                  <InputField
                    label="First Name"
                    name="fname"
                    value={formData.fname}
                    onChange={handleInputChange}
                    error={errors.fname}
                    icon="user"
                  />
                  <InputField
                    label="Last Name"
                    name="lname"
                    value={formData.lname}
                    onChange={handleInputChange}
                    error={errors.lname}
                    icon="user"
                  />
                  <InputField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    error={errors.address}
                    icon="map-marker"
                  />
                  <InputField
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    error={errors.country}
                    icon="globe"
                  />
                  <InputField
                    label="Mobile No"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    error={errors.mobileNo}
                    icon="phone"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoBlock = ({ label, value, icon }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      {icon && (
        <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {getIconPath(icon)}
        </svg>
      )}
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
    </div>
    <p className="text-lg font-medium text-gray-900">
      {value || <span className="text-gray-400">Not provided</span>}
    </p>
  </div>
);

const InputField = ({ label, name, value, onChange, disabled, error, icon }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
      {icon && (
        <svg className="w-4 h-4 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {getIconPath(icon)}
        </svg>
      )}
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
        error
          ? "border-red-500 focus:ring-red-200"
          : "border-gray-300 focus:border-amber-500 focus:ring-amber-200"
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

const getIconPath = (icon) => {
  switch (icon) {
    case "user":
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      );
    case "envelope":
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      );
    case "phone":
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      );
    case "map-marker":
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
      );
    case "globe":
      return (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      );
    default:
      return null;
  }
};

export default UserProfile;