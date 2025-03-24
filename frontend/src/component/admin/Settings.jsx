import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar.jsx"; // Import the Sidebar component
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaBell,
  FaMoon,
  FaSave,
  FaKey,
} from "react-icons/fa"; // Import icons

const Settings = () => {
  // State for form fields
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [systemPreferences, setSystemPreferences] = useState({
    notifications: true,
    darkMode: false,
  });

  // Fetch admin profile data on component mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5555/admin/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data); // Set profile data in state
      } catch (error) {
        console.error("Error fetching admin profile:", error);
      }
    };

    fetchAdminProfile();
  }, []);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5555/admin/",
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Profile updated successfully!");
      console.log("Updated Profile:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Password changed successfully!");
    console.log("Updated Password:", password);
  };

  // Handle system preferences change
  const handleSystemPreferencesChange = (e) => {
    const { name, checked } = e.target;
    setSystemPreferences((prev) => ({ ...prev, [name]: checked }));
    console.log("Updated System Preferences:", systemPreferences);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-blue-200">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Profile Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Admin Profile Settings</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaUser className="mr-2" /> Name
                </div>
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="mt-1 block w-full p-2 border bg-blue-50 border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaEnvelope className="mr-2" /> Email
                </div>
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="mt-1 block w-full p-2 border bg-blue-50 border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <FaSave className="mr-2" /> Update Profile
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Admin Password Settings</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaLock className="mr-2" /> Current Password
                </div>
              </label>
              <input
                type="password"
                value={password.currentPassword}
                onChange={(e) =>
                  setPassword({ ...password, currentPassword: e.target.value })
                }
                className="mt-1 block w-full p-2 border bg-blue-50 border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaKey className="mr-2" /> New Password
                </div>
              </label>
              <input
                type="password"
                value={password.newPassword}
                onChange={(e) =>
                  setPassword({ ...password, newPassword: e.target.value })
                }
                className="mt-1 block w-full p-2 border bg-blue-50 border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center">
                  <FaKey className="mr-2" /> Confirm New Password
                </div>
              </label>
              <input
                type="password"
                value={password.confirmPassword}
                onChange={(e) =>
                  setPassword({ ...password, confirmPassword: e.target.value })
                }
                className="mt-1 block w-full p-2 border bg-blue-50 border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              <FaSave className="mr-2" /> Change Password
            </button>
          </form>
        </div>

        {/* System Preferences */}
        <div>
          <h2 className="text-xl font-semibold mb-4">System Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="notifications"
                checked={systemPreferences.notifications}
                onChange={handleSystemPreferencesChange}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <FaBell className="mr-2" /> Enable Notifications
                </div>
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="darkMode"
                checked={systemPreferences.darkMode}
                onChange={handleSystemPreferencesChange}
                className="h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <FaMoon className="mr-2" /> Dark Mode
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;