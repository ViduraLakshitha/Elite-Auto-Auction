import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUserAdmin } from "../api/api";
import { useNavigate } from "react-router-dom";

// import "./AdminDashboard.css"; // Import the CSS file

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUserAdmin(userId);
      setUsers(users.filter((user) => user._id !== userId)); // Remove deleted user from the list
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Country</th>
            <th>Mobile No</th>
            <th>Account State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id || index}> {/* Use index as a fallback key */}
                  <td>{index + 1}</td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.country}</td>
                  <td>{user.mobileNo}</td>
                  <td>{user.accountState}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No users found</td>
              </tr>
            )}
          </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;