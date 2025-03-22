import React, { useState, useEffect } from 'react';
import { getUsers, getUserById, updateUser, deleteUser } from '../api/api';
// import '../UserProfile.css';

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
  });

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getUsers();
      setUsers(response.data);
    };
    fetchUsers();
  }, []);

  // Fetch a specific user's details
  const handleSelectUser = async (id) => {
    const response = await getUserById(id);
    setSelectedUser(response.data);
    setFormData(response.data.profileDetails);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedUser) {
      const updatedUser = await updateUser(selectedUser._id, { profileDetails: formData });
      setSelectedUser(updatedUser.data);
      alert('Profile updated successfully');
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user._id !== id));
    alert('User deleted successfully');
  };

  return (
    <div className="user-profile-container">
      <h2>User Profile </h2>
      <div className="user-list">
        <h3>Select a User</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id} onClick={() => handleSelectUser(user._id)}>
              {user.username} ({user.role})
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <form onSubmit={handleSubmit}>
          <h3>Edit Profile: {selectedUser.username}</h3>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
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
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => handleDeleteUser(selectedUser._id)}>
            Delete User
          </button>
        </form>
      )}
    </div>
  );
};

export default UserProfile;