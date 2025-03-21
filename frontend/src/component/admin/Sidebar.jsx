import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/admin"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/admin"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Manage Users
            </Link>
          </li>
          <li>
            <Link
              to="/admin/sellers"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Seller Scoreboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin/buyers"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Buyer Scoreboard
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Vehicle Registration
            </Link>
          </li>
          <li>
            <Link
              to="/admin/settings"
              className="block p-2 hover:bg-gray-700 rounded"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;