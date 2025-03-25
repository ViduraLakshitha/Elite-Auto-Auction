import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SearchBar from "./SearchBar.jsx";
import ScoreboardPopup from "../scoreboard/ScoreboardPopup.jsx"; // Import the ScoreboardPopup component

const Navbar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [scoreboardDropdownOpen, setScoreboardDropdownOpen] = useState(false);
  const [scoreboardPopupOpen, setScoreboardPopupOpen] = useState(false);
  const [selectedScoreboardType, setSelectedScoreboardType] = useState(null);

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleScoreboardDropdown = () => {
    setScoreboardDropdownOpen(!scoreboardDropdownOpen);
  };

  const handleScoreboardSelection = (type) => {
    setSelectedScoreboardType(type);
    setScoreboardPopupOpen(true);
    setScoreboardDropdownOpen(false); // Close the dropdown after selection
  };

  const closeScoreboardPopup = () => {
    setScoreboardPopupOpen(false);
  };

  return (
    <>
      <nav className="container mx-auto flex py-6 " id="navBar">
        <div className="flex mt-1.5 ml-8">
          <Link to="/" className="text-2xl font-medium">
            Elite Auto Auction
          </Link>
        </div>

        <div className="hidden md:flex ml-20 mt-3 space-x-10">
          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Auctions
          </Link>

          <Link
            to="/register-vehicle"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Submit a Vehicle
          </Link>

          {/* Scoreboard Dropdown */}
          <div className="relative">
            <button
              onClick={toggleScoreboardDropdown}
              className="text-gray-700 hover:text-black text-sm font-medium uppercase focus:outline-none"
            >
              Score Board
            </button>
            {scoreboardDropdownOpen && (
              <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  onClick={() => handleScoreboardSelection("seller")}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Seller Scoreboard
                </button>
                <button
                  onClick={() => handleScoreboardSelection("buyer")}
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Buyer Scoreboard
                </button>
              </div>
            )}
          </div>

          <Link
            to="/payments"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            About Us
          </Link>

          <Link
            to="/admin"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Contact Us
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex ml-15 space-x-10">
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700 flex mt-2" />
          </Link>

          <SearchBar />

          {/* <button onClick={toggleNavDrawer} className="md:hidden flex mt-2">
            <HiBars3BottomRight className="h-6 w-6" />
          </button> */}
        </div>
        {/* Login button */}
        <Link to="/login">
        <button className="bg-blue-700 w-20 h-10 text-white rounded ml-10">
          Login
        </button>
      </Link>

          {/* signin button */}
          <Link to="/signup">
        <button className="bg-blue-700 w-20 h-10 text-white rounded ml-5">
          SignUp
        </button>
      </Link>
      </nav>

      {/* Mobile Navigation */}
      {/* <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Auctions
            </Link>

            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Submit a Vehicle
            </Link>

            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Score Board
            </Link>

            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              About Us
            </Link>

            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Contact Us
            </Link>
          </nav>
        </div> */}
      {/* </div> */}

      {/* Scoreboard Popup */}
      {scoreboardPopupOpen && (
        <ScoreboardPopup
          type={selectedScoreboardType}
          onClose={closeScoreboardPopup}
        />
      )}
    </>
  );
};

export default Navbar;