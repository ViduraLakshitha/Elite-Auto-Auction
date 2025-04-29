import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../component/admin/Sidebar.jsx";
import Papa from "papaparse";

const AdminDashboard = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  // Handle welcome message
  useEffect(() => {
    if (location.state?.showWelcome) {
      setWelcomeMessage(location.state.welcomeMessage);
      setShowWelcome(true);

      const timer = setTimeout(() => setShowWelcome(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5555/user/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Approve user
  const handleApproveUser = async (userId) => {
    try {
      await axios.put(`http://localhost:5555/user/${userId}`, { accountState: "active" });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, accountState: "active" } : user
        )
      );
      alert("User approved successfully!");
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Failed to approve user. Please try again.");
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5555/user/${userId}`);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  // Filtered users
  const filteredUsers = users.filter((user) =>
    (`${user.fname ?? ""} ${user.lname ?? ""} ${user.email ?? ""}`)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Generate CSV Report
  const generateCSVReport = () => {
    if (filteredUsers.length === 0) {
      alert("No users available to download.");
      return;
    }

    const csvData = filteredUsers.map((user) => ({
      "First Name": user.fname || "",
      "Last Name": user.lname || "",
      "Email": user.email || "",
      "Address": user.address || "",
      "Country": user.country || "",
      "Mobile No": user.mobileNo || "",
      "Account State": user.accountState || "",
    }));

    const csv = Papa.unparse(csvData, { header: true });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "luxury_vehicle_auction_users_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center text-red-500 text-xl">{error}</div>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 bg-gradient-to-brflex min-h-screen bg-gray-100 from-gray-800 to-gray-900 text-gray-900 font-bold ">

        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-6 p-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-yellow-900 font-bold text-xl rounded-lg shadow-lg animate-pulse">
            {welcomeMessage} 🚀 Welcome to the Luxury Auction Admin Panel!
          </div>
        )}

        {/* Header */}
        <h2 className="text-4xl font-extrabold text-gray-800 mb-8">Manage User Profiles</h2>

        {/* Search & CSV Download */}
        <div className="flex items-center justify-between mb-6">
          <input
            type="text"
            placeholder="🔎 Search users..."
            className="w-1/2 p-3 border-2 border-gray-900 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={generateCSVReport}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
          >
            📄 Download User Report
          </button>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto rounded-xl shadow-2xl border border-gray-700">
          <table className="min-w-full bg-gray-50 rounded-xl overflow-hidden">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Full Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Country</th>
                <th className="py-3 px-6 text-left">Mobile No</th>
                <th className="py-3 px-6 text-left">Account State</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-950 text-sm font-light">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-6">{index + 1}</td>
                    <td className="py-3 px-6">{`${user.fname} ${user.lname}`}</td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">{user.address}</td>
                    <td className="py-3 px-6">{user.country}</td>
                    <td className="py-3 px-6">{user.mobileNo}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`py-1 px-3 rounded-full text-xs ${
                          user.accountState === "active"
                            ? "bg-green-200 text-green-800"
                            : user.accountState === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {user.accountState}
                      </span>
                    </td>
                    <td className="py-3 px-6 flex items-center justify-center space-x-2">
                      {user.accountState !== "active" && (
                        <button
                          onClick={() => handleApproveUser(user._id)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-full text-sm font-semibold"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-full text-sm font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500 text-lg">
                    No users found.
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
