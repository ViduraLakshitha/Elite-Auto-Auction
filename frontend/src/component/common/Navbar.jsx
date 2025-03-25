import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  return (
    <>
      <nav
        className="container mx-auto flex py-6 "
        id="navBar"
      >
        <div className="flex mt-1.5">
          <Link to="/" className="text-2xl font-medium ">
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
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Submit a Vehicle
          </Link>

          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Score Board
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
        <button className="bg-blue-700 w-20 h-10 text-white border: rounded ml-10">
            Loogin
          </button>

          {/* signin button */}
        <button className="bg-blue-700 w-20 h-10 text-white border: rounded ml-5">
            Signin
          </button>

      </nav>

      {/* Mobile Navigation */}

      <div
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
          <h2 className="text-xl font-semibold mb-4"> Menu </h2>
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
        </div>
      </div>
    </>
  );
};

export default Navbar;
