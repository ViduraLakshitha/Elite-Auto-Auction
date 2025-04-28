import React, { useState, useEffect } from "react";
import axios from "axios";

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

  // Assume email is stored in localStorage after login
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/user/email/${userEmail}`);
        setUser(response.data);
        setFormData({
          fname: response.data.fname || "",
          lname: response.data.lname || "",
          email: response.data.email || "",
          address: response.data.address || "",
          country: response.data.country || "",
          mobileNo: response.data.mobileNo || "",
        });

        const paymentResponse = await axios.get(
          `http://localhost:5555/user/${response.data._id}/payments`
        );
        setPaymentHistory(paymentResponse.data);

      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserProfile();
    } else {
      alert("No user email found. Please log in again.");
      setLoading(false);
    }
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      validateEmail(value);
    } else if (name === "mobileNo") {
      validateMobileNo(value);
    }
  };

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

  const validateMobileNo = (mobileNo) => {
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    if (!mobileRegex.test(mobileNo)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNo: "Invalid mobile number format",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, mobileNo: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    validateEmail(formData.email);
    validateMobileNo(formData.mobileNo);

    if (errors.email || errors.mobileNo) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5555/user/${user._id}`,
        formData
      );
      setUser(response.data);
      alert("Profile updated successfully!");
      setShowDetails(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-xl font-semibold text-gray-700">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-xl font-semibold text-red-700">
        User not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-white p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-4xl">
        <h2 className="text-4xl font-extrabold text-indigo-800 mb-10 text-center tracking-wide">
          My Profile
        </h2>

        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-lg p-8 border">
          {/* Toggle Buttons */}
          <div className="flex justify-center gap-6 mb-8">
            <button
              onClick={() => setShowDetails(true)}
              className={`px-6 py-2 rounded-full font-semibold ${
                showDetails ? "bg-indigo-700 text-white" : "bg-gray-200 text-gray-700"
              } transition-all`}
            >
              View Profile
            </button>
            <button
              onClick={() => setShowDetails(false)}
              className={`px-6 py-2 rounded-full font-semibold ${
                !showDetails ? "bg-indigo-700 text-white" : "bg-gray-200 text-gray-700"
              } transition-all`}
            >
              Edit Profile
            </button>
          </div>

          {showDetails ? (
            // View Details
            <div className="space-y-4 text-lg text-gray-700">
              <p><strong>First Name:</strong> {user.fname}</p>
              <p><strong>Last Name:</strong> {user.lname}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>Country:</strong> {user.country}</p>
              <p><strong>Mobile No:</strong> {user.mobileNo}</p>
              <p><strong>Account State:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                  user.accountState === "active"
                    ? "bg-green-100 text-green-700"
                    : user.accountState === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {user.accountState}
                </span>
              </p>

              {/* Payment History */}
              <div className="mt-8">
                <h4 className="text-xl font-semibold text-indigo-700 mb-4">
                  Payment History
                </h4>
                {paymentHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-center text-sm">
                      <thead className="bg-indigo-100">
                        <tr>
                          <th className="p-2 border">Auction ID</th>
                          <th className="p-2 border">Amount</th>
                          <th className="p-2 border">Date</th>
                          <th className="p-2 border">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((payment) => (
                          <tr key={payment._id} className="hover:bg-indigo-50">
                            <td className="p-2 border">{payment.auctionId}</td>
                            <td className="p-2 border">${payment.amount.toFixed(2)}</td>
                            <td className="p-2 border">{new Date(payment.date).toLocaleDateString()}</td>
                            <td className="p-2 border">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">No payment history available.</p>
                )}
              </div>
            </div>
          ) : (
            // Edit Form
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "First Name", name: "fname" },
                { label: "Last Name", name: "lname" },
                { label: "Address", name: "address" },
                { label: "Country", name: "country" },
                { label: "Mobile No", name: "mobileNo" }
              ].map((field) => (
                <label key={field.name} className="block">
                  {field.label}:
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full mt-1 p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    required
                  />
                </label>
              ))}
              <label className="block">
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
                />
              </label>

              <button
                type="submit"
                className="w-full mt-6 bg-indigo-700 text-white py-3 rounded-lg font-bold hover:bg-indigo-800 transition-all"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
