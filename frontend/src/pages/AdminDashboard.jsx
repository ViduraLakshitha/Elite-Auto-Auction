import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../component/admin/Sidebar.jsx"; // Import the Sidebar component

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5555/user/");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5555/user/${userId}`);
      setUsers(users.filter((user) => user._id !== userId)); // Remove deleted user from the list
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-6">User Profiles</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                Number
              </th>
              <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                Full Name
              </th>
              <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                Email
              </th>
              <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                Address
              </th>
              <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                Country
              </th>
              <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                Mobile No
              </th>
              <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                Account State
              </th>
              <th className="p-3 text-left text-sm font-medium uppercase text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 text-sm text-gray-700">{index + 1}</td>
                  <td className="p-3 text-sm text-gray-700">{`${user.fName} ${user.lname}`}</td>
                  <td className="p-3 text-sm text-gray-700">{user.email}</td>
                  <td className="p-3 text-sm text-gray-700">{user.address}</td>
                  <td className="p-3 text-sm text-gray-700">{user.country}</td>
                  <td className="p-3 text-sm text-gray-700">{user.mobileNo}</td>
                  <td className="p-3 text-sm text-gray-700">
                    {user.accountState}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-sm text-gray-700 text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;