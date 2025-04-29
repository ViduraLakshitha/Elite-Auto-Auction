import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineUser, HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { FaCrown } from "react-icons/fa"; // New crown icon for premium feel
import { FaTruck } from "react-icons/fa";
import SearchBar from "./SearchBar.jsx";

const Navbar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [scoreboardDropdownOpen, setScoreboardDropdownOpen] = useState(false);
  const [scoreboardPopupOpen, setScoreboardPopupOpen] = useState(false);
  const [selectedScoreboardType, setSelectedScoreboardType] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
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
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg">
        <div className="container mx-auto px-6 py-4 text-sm flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FaCrown className="text-amber-400 h-4 w-4" />
            <Link 
              to="/" 
              className="font-serif text-lg text-white tracking-wider"
            >
              ELITE<span className="text-amber-400">AUTO</span>AUCTIONS
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex space-x-8">
              <Link
                to="/auctions"
                className="text-gray-300 hover:text-amber-400 text-sm font-medium uppercase tracking-wider transition-colors duration-300"
              >
                AUCTIONS
              </Link>
              <Link
                to="/register-vehicle"
                className="text-gray-300 hover:text-amber-400 text-sm font-medium uppercase tracking-wider transition-colors duration-300"
              >
                SUBMIT VEHICLE
              </Link>
              <Link
            to="/register-transportation"
            className="text-gray-300 hover:text-amber-400 text-sm font-medium uppercase tracking-wider transition-colors duration-300"
          >
            Transportation
          </Link>
          <Link
                to="/scoreboard"
                className="text-gray-300 hover:text-amber-400 text-sm font-medium uppercase tracking-wider transition-colors duration-300"
              >
                SCOREBOARD
              </Link>
              <Link
                to="/about"
                className="text-gray-300 hover:text-amber-400 text-sm font-medium uppercase tracking-wider transition-colors duration-300"
              >
                ABOUTUS
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 hover:text-amber-400 text-sm font-medium uppercase tracking-wider transition-colors duration-300"
              >
                CONTACTUS
              </Link>
            </div>

            <div className="flex items-center space-x-6 ml-8">
              <SearchBar />
              
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="bg-transparent border border-amber-400 text-amber-400 px-4 py-2 rounded-md text-sm uppercase tracking-wider hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300"
                  >
                    LOGOUT
                  </button>
                  <Link 
                    to="/profile" 
                    className="text-gray-300 hover:text-amber-400 transition-colors duration-300"
                  >
                    <HiOutlineUser className="h-6 w-6" />
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="bg-transparent border border-gray-300 text-gray-300 px-4 py-2 rounded-md text-sm uppercase tracking-wider hover:bg-gray-700 hover:text-white transition-colors duration-300">
                      LOGIN
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="bg-amber-500 text-gray-900 px-4 py-2 rounded-md text-sm uppercase tracking-wider hover:bg-amber-400 transition-colors duration-300">
                      REGISTER
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleNavDrawer} 
            className="lg:hidden text-gray-300 hover:text-amber-400 focus:outline-none"
          >
            <HiBars3BottomRight className="h-8 w-8" />
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {navDrawerOpen && (
          <div className="lg:hidden bg-gray-800 shadow-xl fixed inset-0 z-50 overflow-y-auto">
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FaCrown className="text-amber-400 h-6 w-6" />
                  <span className="text-xl font-serif font-medium text-white tracking-wider">
                    ELITE AUTO AUCTIONS
                  </span>
                </div>
                <button 
                  onClick={toggleNavDrawer} 
                  className="text-gray-300 hover:text-amber-400 focus:outline-none"
                >
                  <IoMdClose className="h-8 w-8" />
                </button>
              </div>

              <div className="mt-12 flex flex-col space-y-8">
                <Link
                  to="/auctions"
                  className="text-gray-300 hover:text-amber-400 text-lg uppercase tracking-wider transition-colors duration-300"
                  onClick={toggleNavDrawer}
                >
                  Auctions
                </Link>
                <Link
                  to="/register-vehicle"
                  className="text-gray-300 hover:text-amber-400 text-lg uppercase tracking-wider transition-colors duration-300"
                  onClick={toggleNavDrawer}
                >
                  Submit Vehicle
                </Link>
                <Link
                  to="/scoreboard"
                  className="text-gray-300 hover:text-amber-400 text-lg uppercase tracking-wider transition-colors duration-300"
                  onClick={toggleNavDrawer}
                >
                  Scoreboard
                </Link>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-amber-400 text-lg uppercase tracking-wider transition-colors duration-300"
                  onClick={toggleNavDrawer}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-amber-400 text-lg uppercase tracking-wider transition-colors duration-300"
                  onClick={toggleNavDrawer}
                >
                  Contact Us
                </Link>

                <div className="pt-8 border-t border-gray-700">
                  {isLoggedIn ? (
                    <div className="flex flex-col space-y-6">
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleNavDrawer();
                        }}
                        className="w-full bg-transparent border border-amber-400 text-amber-400 px-6 py-3 rounded-md text-lg uppercase tracking-wider hover:bg-amber-400 hover:text-gray-900 transition-colors duration-300"
                      >
                        Logout
                      </button>
                      <Link
                        to="/profile"
                        className="text-center text-gray-300 hover:text-amber-400 text-lg uppercase tracking-wider transition-colors duration-300"
                        onClick={toggleNavDrawer}
                      >
                        My Profile
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-6">
                      <Link
                        to="/login"
                        className="w-full bg-transparent border border-gray-300 text-gray-300 px-6 py-3 rounded-md text-lg uppercase tracking-wider hover:bg-gray-700 hover:text-white transition-colors duration-300 text-center"
                        onClick={toggleNavDrawer}
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        className="w-full bg-amber-500 text-gray-900 px-6 py-3 rounded-md text-lg uppercase tracking-wider hover:bg-amber-400 transition-colors duration-300 text-center"
                        onClick={toggleNavDrawer}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation Drawer */}
      {navDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
          <div className="bg-white h-full w-64 p-5 shadow-lg transform transition-transform duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Menu</h3>
              <button onClick={toggleNavDrawer}>
                <IoMdClose className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-col space-y-4">
              <Link
                to="/auctions"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase py-2 border-b"
                onClick={toggleNavDrawer}
              >
                Auctions
              </Link>
              <Link
                to="/register-vehicle"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase py-2 border-b"
                onClick={toggleNavDrawer}
              >
                Submit a Vehicle
              </Link>
              <Link
                to="/register-transportation"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase py-2 border-b flex items-center"
                onClick={toggleNavDrawer}
              >
                <FaTruck className="mr-2" /> Transportation
              </Link>
              <Link
                to="/scoreboard"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase py-2 border-b"
                onClick={toggleNavDrawer}
              >
                Scoreboard
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase py-2 border-b"
                onClick={toggleNavDrawer}
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-black text-sm font-medium uppercase py-2 border-b"
                onClick={toggleNavDrawer}
              >
                Contact Us
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/profile"
                    className="text-gray-700 hover:text-black text-sm font-medium uppercase py-2 border-b"
                    onClick={toggleNavDrawer}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleNavDrawer();
                    }}
                    className="bg-red-600 w-full py-2 text-white rounded"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 mt-4">
                  <Link to="/login" onClick={toggleNavDrawer}>
                    <button className="bg-blue-700 w-full py-2 text-white rounded">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={toggleNavDrawer}>
                    <button className="bg-blue-700 w-full py-2 text-white rounded">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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