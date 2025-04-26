import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaChartLine, FaUsers, FaTrophy, FaShoppingCart, FaCar, FaCog, FaSignOutAlt, FaGavel } from "react-icons/fa";

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminDetails");
    window.location.href = "/admin/login";
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link to="/" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaHome className="mr-2" /> Home
            </Link>
          </li>
          <li>
            <Link to="/admin/chart" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaChartLine className="mr-2" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/admin" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaUsers className="mr-2" /> Manage Users
            </Link>
          </li>
          <li>
            <Link to="/admin/sellers" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaTrophy className="mr-2" /> Seller Scoreboard
            </Link>
          </li>
          <li>
            <Link to="/admin/buyers" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaShoppingCart className="mr-2" /> Buyer Scoreboard
            </Link>
          </li>
          <li>
            <Link to="/Auction" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaGavel className="mr-2" /> Auction Details
            </Link>
          </li>
          <li>
            <Link to="/admin/vehicles" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaCar className="mr-2" /> Vehicle Details
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <FaCog className="mr-2" /> Settings
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full p-2 hover:bg-gray-700 rounded"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;