import React, { useState, useEffect } from "react";  // <-- Add useEffect here
import { Link, useNavigate } from "react-router-dom";  // Add useNavigate
import { HiOutlineUser, HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SearchBar from "./SearchBar.jsx";
import ScoreboardPopup from "../scoreboard/ScoreboardPopup.jsx";

const Navbar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [scoreboardDropdownOpen, setScoreboardDropdownOpen] = useState(false);
  const [scoreboardPopupOpen, setScoreboardPopupOpen] = useState(false);
  const [selectedScoreboardType, setSelectedScoreboardType] = useState(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- new state
  const navigate = useNavigate(); // <-- for logout if needed

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Optional: Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
     // redirect to login after logout
  };

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleScoreboardDropdown = () => {
    setScoreboardDropdownOpen(!scoreboardDropdownOpen);
  };

  const handleScoreboardSelection = (type) => {
    setSelectedScoreboardType(type);
    setScoreboardPopupOpen(true);
    setScoreboardDropdownOpen(false);
  };

  const closeScoreboardPopup = () => {
    setScoreboardPopupOpen(false);
  };

  return (
    <>
      <nav className="container mx-auto flex py-6 ml-15" id="navBar">
        <div className="flex mt-1.5">
          <Link to="/" className="text-2xl font-medium">
            Elite Auto Auction
          </Link>
        </div>

        <div className="hidden md:flex ml-20 mt-3 space-x-10">
          <Link
            to="/auctions"
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
          <Link
            to="/scoreboard"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Scoreboard
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Contact Us
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex ml-15 items-center">
          <SearchBar />

          {isLoggedIn ? (
            // If user is logged in, show Profile and Logout button
            <>
              

              <button
                onClick={handleLogout}
                className="bg-red-600 w-20 h-10 text-white rounded ml-5"
              >
                Logout
              </button>

              <Link to="/profile" className="hover:text-black">
                <HiOutlineUser className="h-6 w-6 text-gray-700 ml-15" />
              </Link>
            </>
          ) : (
            // If user is not logged in, show Login and SignUp buttons
            <>
              <Link to="/login">
                <button className="bg-blue-700 w-20 h-10 text-white rounded ml-5">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-blue-700 w-20 h-10 text-white rounded ml-5">
                  Sign Up
                </button>
              </Link>
            </>
          )}

          <button onClick={toggleNavDrawer} className="md:hidden flex">
            <HiBars3BottomRight className="h-6 w-6" />
          </button>
        </div>
      </nav>

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