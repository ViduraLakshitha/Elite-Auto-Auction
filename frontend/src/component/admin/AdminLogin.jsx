import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const adminCredentials = {
    username: "admin",
    password: "admin123",
    name: "Admin Themiya",
    email: "admin@example.com"
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    if (username === adminCredentials.username && password === adminCredentials.password) {
      localStorage.setItem("isAdminLoggedIn", "true");
      localStorage.setItem("adminDetails", JSON.stringify({
        name: adminCredentials.name,
        email: adminCredentials.email
      }));
       // Pass the admin name as state when navigating
    navigate("/admin/chart", { 
      state: { 
        welcomeMessage: `Welcome, ${adminCredentials.name}!`,
        showWelcome: true 
      } 
    });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
  <div className="bg-opacity-80 bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-yellow-600">
    <h1 className="text-3xl font-serif font-bold text-center mb-4 text-yellow-500">
      Elite Auto Auction Admin
    </h1>
    <p className="text-center text-sm text-gray-400 mb-6 italic">
      Secure Access • Classical Elegance
    </p>
    
    {error && (
      <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
        {error}
      </div>
    )}

    <form onSubmit={handleLogin}>
      {/* Username Input */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
          Username
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaUser className="text-yellow-400" />
          </div>
          <input
            type="text"
            id="username"
            className="pl-10 w-full p-2 bg-gray-800 border border-yellow-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaLock className="text-yellow-400" />
          </div>
          <input
            type="password"
            id="password"
            className="pl-10 w-full p-2 bg-gray-800 border border-yellow-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-colors"
      >
        Login
      </button>
    </form>
  </div>
</div>

  );
};

export default AdminLogin;