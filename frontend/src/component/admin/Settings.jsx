import React, { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import { FaUser, FaEnvelope, FaLock, FaBell, FaMoon, FaSave, FaKey } from "react-icons/fa";

const Settings = () => {
  // Get admin details from localStorage
  const savedAdmin = JSON.parse(localStorage.getItem("adminDetails") || '{}');
  
  const [profile, setProfile] = useState({
    name: savedAdmin.name || "",
    email: savedAdmin.email || ""
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

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // Update localStorage with new profile data
    localStorage.setItem("adminDetails", JSON.stringify(profile));
    alert("Profile updated successfully!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    alert("Password changed successfully!");
    setPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSystemPreferencesChange = (e) => {
    const { name, checked } = e.target;
    setSystemPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 p-6 bg-blue-200">
        <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

        {/* Profile Settings */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaUser className="mr-2" /> Profile Information
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              <FaSave className="mr-2" /> Update Profile
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaLock className="mr-2" /> Password Settings
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={password.currentPassword}
                onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password.newPassword}
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={password.confirmPassword}
                onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
            >
              <FaSave className="mr-2" /> Change Password
            </button>
          </form>
        </div>

        {/* System Preferences */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">System Preferences</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={systemPreferences.notifications}
                onChange={handleSystemPreferencesChange}
                className="h-4 w-4 text-blue-500 rounded"
              />
              <label htmlFor="notifications" className="ml-2 flex items-center">
                <FaBell className="mr-2" /> Enable Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={systemPreferences.darkMode}
                onChange={handleSystemPreferencesChange}
                className="h-4 w-4 text-blue-500 rounded"
              />
              <label htmlFor="darkMode" className="ml-2 flex items-center">
                <FaMoon className="mr-2" /> Dark Mode
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;