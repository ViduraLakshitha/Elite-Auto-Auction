import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
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
  const [showDetails, setShowDetails] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]); // State for payment history
  const navigate = useNavigate();

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5555/user/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection
  const handleSelectUser = async (id) => {
    console.log("Selected User ID:", id); // Log the ID
    try {
      const response = await axios.get(`http://localhost:5555/user/${id}`);
      setSelectedUser(response.data);
      setFormData({
        fname: response.data.fname || "",
        lname: response.data.lname || "",
        email: response.data.email || "",
        address: response.data.address || "",
        country: response.data.country || "",
        mobileNo: response.data.mobileNo || "",
      });
      setErrors({}); // Clear errors when selecting a new user
      setShowDetails(true); // Show details when a user is selected

      // Fetch payment history for the selected user
      const paymentResponse = await axios.get(
        `http://localhost:5555/user/${id}/payments`
      );
      setPaymentHistory(paymentResponse.data);
    } catch (error) {
      console.error("Error fetching user or payment history:", error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate input on change
    if (name === "email") {
      validateEmail(value);
    } else if (name === "mobileNo") {
      validateMobileNo(value);
    }
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  // Validate mobile number
  const validateMobileNo = (mobileNo) => {
    const mobileRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    if (!mobileRegex.test(mobileNo)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNo: "Invalid mobile number format",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobileNo: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    validateEmail(formData.email);
    validateMobileNo(formData.mobileNo);

    // Check if there are any errors
    if (errors.email || errors.mobileNo) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5555/user/${selectedUser._id}`,
        formData
      );
      setSelectedUser(response.data);
      alert("Profile updated successfully");

      // Refresh the user list
      const updatedUsers = users.map((user) =>
        user._id === selectedUser._id ? response.data : user
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User List */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-3">Select a User</h3>
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li
                key={user._id}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectUser(user._id)}
              >
                {user.fname} {user.lname} ({user.accountState})
              </li>
            ))}
          </ul>
        </div>

        {/* User Details or Edit Form */}
        {selectedUser && (
          <div className="bg-blue-200 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              {showDetails ? "User Details" : "Edit Profile"}:{" "}
              {selectedUser.fname} {selectedUser.lname}
            </h3>

            {/* Toggle between Details and Edit Form */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowDetails(true)}
                className={`px-4 py-2 rounded ${
                  showDetails
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                View Details
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className={`px-4 py-2 rounded ${
                  !showDetails
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                Edit Profile
              </button>
            </div>

            {/* User Details Page */}
            {showDetails ? (
              <div className="space-y-4">
                <p>
                  <strong>First Name:</strong> {selectedUser.fname}
                </p>
                <p>
                  <strong>Last Name:</strong> {selectedUser.lname}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser.email}
                </p>
                <p>
                  <strong>Address:</strong> {selectedUser.address}
                </p>
                <p>
                  <strong>Country:</strong> {selectedUser.country}
                </p>
                <p>
                  <strong>Mobile No:</strong> {selectedUser.mobileNo}
                </p>
                <p>
                  <strong>Account State:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      selectedUser.accountState === "active"
                        ? "bg-green-100 text-green-700"
                        : selectedUser.accountState === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedUser.accountState}
                  </span>
                </p>

                {/* Payment History Section */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold mb-3">Payment History</h4>
                  {paymentHistory.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="p-2 border border-gray-300">Auction ID</th>
                          <th className="p-2 border border-gray-300">Amount</th>
                          <th className="p-2 border border-gray-300">Date</th>
                          <th className="p-2 border border-gray-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment._id} className="hover:bg-gray-50">
                            <td className="p-2 border border-gray-300">
                              {payment.auctionId}
                            </td>
                            <td className="p-2 border border-gray-300">
                              ${payment.amount.toFixed(2)}
                            </td>
                            <td className="p-2 border border-gray-300">
                              {new Date(payment.date).toLocaleDateString()}
                            </td>
                            <td className="p-2 border border-gray-300">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                  ) : (
                    <p className="text-gray-600">No payment history available.</p>
                  )}
                </div>
              </div>
            ) : (
              // Edit Profile Form
              <form onSubmit={handleSubmit}>
                <label className="block mb-2">
                  First Name:
                  <input
                    type="text"
                    name="fname"
                    value={formData.fname}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-white"
                    required
                  />
                </label>
                <label className="block mb-2">
                  Last Name:
                  <input
                    type="text"
                    name="lname"
                    value={formData.lname}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-white"
                    required
                  />
                </label>
                <label className="block mb-2">
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    // onChange={handleInputChange}
                    disabled className={`w-full p-2 border rounded bg-white${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </label>
                <label className="block mb-2">
                  Address:
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-white"
                    required
                  />
                </label>
                <label className="block mb-2">
                  Country:
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-white"
                    required
                  />
                </label>
                <label className="block mb-4">
                  Mobile No:
                  <input
                    type="text"
                    name="mobileNo"
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded bg-white ${
                      errors.mobileNo ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.mobileNo && (
                    <p className="text-red-500 text-sm mt-1">{errors.mobileNo}</p>
                  )}
                </label>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;