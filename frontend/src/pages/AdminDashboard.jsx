import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../component/admin/Sidebar.jsx";
import Papa from "papaparse"; // Import papaparse for CSV generation

const AdminDashboard = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

   // Check for welcome message from login
   useEffect(() => {
    if (location.state?.showWelcome) {
      setWelcomeMessage(location.state.welcomeMessage);
      setShowWelcome(true);
      
      // Hide welcome message after 3 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5555/user/");
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users. Please try again later.");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle Approved User
  const handleApproveUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5555/user/${userId}` , { accountState: "active" });
      setUsers(users.map((user) =>
        user._id === userId ? { ...user, accountState: "active" } : user
      ));
      alert("User approved successfully!");
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Failed to approve user. Please try again.");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5555/user/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    (`${user.fname ?? ""} ${user.lname ?? ""} ${user.email ?? ""}`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Generate CSV Report
  const generateCSVReport = () => {
    const csvData = filteredUsers.map((user) => ({
      "First Name": user.fname,
      "Last Name": user.lname,
      "Email": user.email,
      "Address": user.address,
      "Country": user.country,
      "Mobile No": user.mobileNo,
      "Account State": user.accountState,
    }));

    const csv = Papa.unparse(csvData, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex min-h-screen p-6">Loading...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 p-6 bg-blue-200">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg animate-fade-in">
            <h2 className="text-xl font-semibold">{welcomeMessage}</h2>
            <p>You have successfully logged in to the admin dashboard.</p>
          </div>
        )}

      {/* Main Content */}
      <div className="flex-1 p-6 bg-blue-200">
        <h2 className="text-2xl font-bold mb-6">User Profiles</h2>

        {/* Search Bar and Download Button */}
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="w-1/2 p-2 border bg-blue-50 border-gray-300 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={generateCSVReport}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Download CSV Report
          </button>
        </div>

        {/* User Table */}
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Number
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Full Name
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Email
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Address
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Country
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Mobile No
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Account State
              </th>
              <th className="p-4 text-left text-sm font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="p-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="p-4 text-sm text-gray-700 font-medium">{`${user.fname} ${user.lname}`}</td>
                  <td className="p-4 text-sm text-gray-700">{user.email}</td>
                  <td className="p-4 text-sm text-gray-700">{user.address}</td>
                  <td className="p-4 text-sm text-gray-700">{user.country}</td>
                  <td className="p-4 text-sm text-gray-700">{user.mobileNo}</td>
                  <td className="p-4 text-sm text-gray-700">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.accountState === "active"
                          ? "bg-green-100 text-green-700"
                          : user.accountState === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.accountState}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-700">
                    <div className="flex items-center space-x-2">
                      {/* Approve Button */}
                      {user.accountState !== "active" && (
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-1 px-3 rounded-lg transition-colors duration-200"
                          onClick={() => handleApproveUser(user._id)}
                        >
                          Approve
                        </button>
                      )}
                      {/* Delete Button */}
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-lg transition-colors duration-200"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-8 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

    </div>
  );
};

export default AdminDashboard;