import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaChartLine, FaUsers, FaTrophy, FaShoppingCart, FaCar, FaCog, FaSignOutAlt, FaGavel, FaTruck } from "react-icons/fa";

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminDetails");
    window.location.href = "/admin/login";
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white w-64 min-h-screen p-6 shadow-lg">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gradient bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
        Admin Panel
      </h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link to="/" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaHome className="mr-3 text-xl" /> Home
            </Link>
          </li>
          <li>
            <Link to="/admin/chart" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaChartLine className="mr-3 text-xl" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/admin" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaUsers className="mr-3 text-xl" /> Manage Users
            </Link>
          </li>
          <li>
            <Link to="/scoreboard" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaTrophy className="mr-3 text-xl" /> Scoreboard
            </Link>
          </li>
          {/* <li>
            <Link to="/admin/buyers" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaShoppingCart className="mr-3 text-xl" /> Buyer Scoreboard
            </Link>
          </li> */}
          <li>
            <Link to="/auctions-all" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaGavel className="mr-3 text-xl" /> Auction Details
            </Link>
          </li>
          <li>
            <Link to="/vehicles" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaCar className="mr-3 text-xl" /> Vehicle Details
            </Link>
          </li>
          <li>
            <Link to="/admin/transportation" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaTruck className="mr-3 text-xl" /> Transportation
            </Link>
          </li>
          <li>
            <Link to="/admin/notifications" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaCog className="mr-3 text-xl" /> Notification Setting
            </Link>
          </li>
          <li>
            <Link to="/admin/settings" className="flex items-center p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300">
              <FaCog className="mr-3 text-xl" /> Settings
            </Link>
          </li>
          <li>
            <button 
              onClick={handleLogout}
              className="flex items-center w-full p-3 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-yellow-600 rounded-lg transition duration-300"
            >
              <FaSignOutAlt className="mr-3 text-xl" /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
