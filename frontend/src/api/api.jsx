import axios from "axios";  // Add this import

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchTopSellers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/sellers/top`);
  return response.data;
};

export const fetchTopBuyers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/buyers/top`);
  return response.data;
};

// Get all users (admin only)
export const getAllUsers = async () => {
  const token = localStorage.getItem("token");
  return await axios.get(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Delete a user (admin only)
export const deleteUserAdmin = async (userId) => {
  const token = localStorage.getItem("token");
  return await axios.delete(`${API_URL}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


export const getUsers = () => axios.get(`${API_BASE_URL}/users`);
export const getUserById = (id) => axios.get(`${API_BASE_URL}/users/${id}`);
export const updateUser = (id, data) => axios.put(`${API_BASE_URL}/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`${API_BASE_URL}/users/${id}`);



export const getAllNotifications = () => axios.get("/notifications");

export const deleteNotification = (id) => axios.delete(`/admin/notifications/${id}`);

export const updateNotification = (id, data) => axios.put(`/admin/notifications/${id}`, data);
