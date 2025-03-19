import axios from "axios";

// // Base URL for API requests
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5555/api";

// Fetch top sellers
export const fetchTopSellers = async () => {
  const response = await axios.get(`${API_BASE_URL}/sellers/top`);
  return response.data;
};

// Fetch top buyers
export const fetchTopBuyers = async () => {
  const response = await axios.get(`${API_BASE_URL}/buyers/top`);
  return response.data;
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Delete a user (admin only)
export const deleteUserAdmin = async (userId) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Get all users (general)
export const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`);
  return response.data;
};

// Get a user by ID
export const getUserById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`);
  return response.data;
};

// Update a user
export const updateUser = async (id, data) => {
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, data);
  return response.data;
};

// Delete a user (general)
export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
  return response.data;
};