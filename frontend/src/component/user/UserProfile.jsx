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

          const paymentResponse = await axios.get(`http://localhost:5555/user/${userId}/payments`, config);
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
    if (!/^\+?\d{10,15}$/.test(formData.mobileNo)) newErrors.mobileNo = "Enter valid Mobile No (with optional + and 10-15 digits)";
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

      const response = await axios.put(`http://localhost:5555/user/${user._id}`, formData, config);
      setUser(response.data);
      setShowDetails(true);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Please log in to view your profile.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
        </div>

        {/* Toggle View / Edit */}
        <div className="flex gap-2 p-4 bg-gray-100 border-b border-gray-200">
          <button
            onClick={() => setShowDetails(true)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              showDetails
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            View Details
          </button>
          <button
            onClick={() => setShowDetails(false)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              !showDetails
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Edit Profile
          </button>
          
        </div>

        {showDetails ? (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* View Details */}
              <InfoBlock label="First Name" value={user.fname} />
              <InfoBlock label="Last Name" value={user.lname} />
              <InfoBlock label="Email" value={user.email} />
              <InfoBlock label="Mobile No" value={user.mobileNo} />
              <InfoBlock label="Address" value={user.address} />
              <InfoBlock label="Country" value={user.country} />
            </div>

            {/* Payment History */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">Payment History</h4>
              {paymentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700">
                        <th className="p-3 text-left">Auction ID</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((payment) => (
                        <tr key={payment._id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{payment.auctionId}</td>
                          <td className="p-3">${payment.amount.toFixed(2)}</td>
                          <td className="p-3">{new Date(payment.date).toLocaleDateString()}</td>
                          <td className="p-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">No payment history available.</p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Edit Form */}
              {/** Disabled Email Field */}
              <InputField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
              <InputField
                label="First Name"
                name="fname"
                value={formData.fname}
                onChange={handleInputChange}
                error={errors.fname}
              />
              <InputField
                label="Last Name"
                name="lname"
                value={formData.lname}
                onChange={handleInputChange}
                error={errors.lname}
              />
              <InputField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
              />
              <InputField
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                error={errors.country}
              />
              <InputField
                label="Mobile No"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleInputChange}
                error={errors.mobileNo}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Reusable Component - InfoBlock
const InfoBlock = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-gray-600">{label}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

// Reusable Component - InputField
const InputField = ({ label, name, value, onChange, disabled, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full p-2 border rounded-lg focus:ring-2 ${
        error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
      } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default UserProfile;
