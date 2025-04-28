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
          navigate("/login"); // Redirect to login if not authenticated
        return;
      }
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        // Fetch user details
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
          const paymentResponse = await axios.get(`http://localhost:5555/user/${userId}/payments`, config);
        setPaymentHistory(paymentResponse.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.response && error.response.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem("userId");
          localStorage.removeItem("token");
          navigate("/login"); // Redirect to login on authentication error
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await axios.put(`http://localhost:5555/user/${user._id}`, formData, config);
      setUser(response.data);
      setShowDetails(true); // Switch back to view mode after successful update
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
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
        </div>

      {/* Toggle View / Edit */}
        <div className="flex gap-2 p-4 bg-gray-50">
        <button
          onClick={() => setShowDetails(true)}
            className={`px-4 py-2 rounded transition-colors ${
              showDetails 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          View Details
        </button>
        <button
          onClick={() => setShowDetails(false)}
            className={`px-4 py-2 rounded transition-colors ${
              !showDetails 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
        >
          Edit Profile
        </button>
      </div>

      {showDetails ? (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">First Name</p>
                <p className="font-semibold">{user.fname}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Last Name</p>
                <p className="font-semibold">{user.lname}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{user.email}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Mobile No</p>
                <p className="font-semibold">{user.mobileNo}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Address</p>
                <p className="font-semibold">{user.address}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">Country</p>
                <p className="font-semibold">{user.country}</p>
              </div>
            </div>

          {/* Payment History */}
            <div className="mt-8">
              <h4 className="text-xl font-semibold mb-4">Payment History</h4>
            {paymentHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
          </label>
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
          </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
          </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile No
          </label>
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
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

export default UserProfile;
