import React, { useState, useEffect } from "react";
import axios from "axios";

const UserProfile = () => {
  const [users, setUsers] = useState([]); // List of all users
  const [selectedUser, setSelectedUser] = useState(null); // Selected user data
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    mobileNo: "",
  });

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

  // Fetch a specific user's details
  const handleSelectUser = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5555/user/${id}`);
      setSelectedUser(response.data);
      setFormData({
        fullName: response.data.fullName || "",
        address: response.data.address || "",
        mobileNo: response.data.mobileNo || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (update user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        const response = await axios.put(
          `http://localhost:5555/user/${selectedUser._id}`,
          formData
        );
        setSelectedUser(response.data);
        alert("Profile updated successfully");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile.");
      }
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/user/${id}`);
      setUsers(users.filter((user) => user._id !== id)); // Remove user from UI
      setSelectedUser(null); // Reset form
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>

      {/* User List */}
      <div className="user-list">
        <h3>Select a User</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id} onClick={() => handleSelectUser(user._id)}>
              {user.fullName} ({user.accountState})
            </li>
          ))}
        </ul>
      </div>

      {/* User Profile Form */}
      {selectedUser && (
        <form onSubmit={handleSubmit}>
          <h3>Edit Profile: {selectedUser.fullName}</h3>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Mobile No:
            <input
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Save Changes</button>
          <button
            type="button"
            onClick={() => handleDeleteUser(selectedUser._id)}
          >
            Delete User
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;