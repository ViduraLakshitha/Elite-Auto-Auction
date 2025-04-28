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
      
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-extrabold text-center mb-10 text-gray-8000">
          Admin Settings
        </h1>

        {/* Profile Settings */}
        <div className="mb-10 bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-5 flex items-center text-gray-800">
            <FaUser className="mr-3 text-2xl" /> Profile Information
          </h2>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-gradient-to-l transition duration-300"
            >
              <FaSave className="mr-3 text-xl" /> Update Profile
            </button>
          </form>
        </div>

        {/* Password Settings */}
        <div className="mb-10 bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-5 flex items-center text-gray-800">
            <FaLock className="mr-3 text-2xl" /> Password Settings
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={password.currentPassword}
                onChange={(e) => setPassword({ ...password, currentPassword: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={password.newPassword}
                onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={password.confirmPassword}
                onChange={(e) => setPassword({ ...password, confirmPassword: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
            <button
              type="submit"
              className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-gradient-to-l transition duration-300"
            >
              <FaSave className="mr-3 text-xl" /> Change Password
            </button>
          </form>
        </div>

        {/* System Preferences */}
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-5 text-gray-800">System Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={systemPreferences.notifications}
                onChange={handleSystemPreferencesChange}
                className="h-5 w-5 text-yellow-500 rounded-xl"
              />
              <label htmlFor="notifications" className="ml-3 text-lg font-medium text-gray-700 flex items-center">
                <FaBell className="mr-3 text-xl" /> Enable Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={systemPreferences.darkMode}
                onChange={handleSystemPreferencesChange}
                className="h-5 w-5 text-yellow-500 rounded-xl"
              />
              <label htmlFor="darkMode" className="ml-3 text-lg font-medium text-gray-700 flex items-center">
                <FaMoon className="mr-3 text-xl" /> Dark Mode
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
