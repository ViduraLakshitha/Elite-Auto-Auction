import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser, HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";

const Navbar = () => {
  return (
    <>
      <nav
        className="container mx-auto flex iterms-center  py-6 px-6"
        id="navBar"
      >
        <div className="flex mt-1.5">
          <Link to="/" className="text-2xl font-medium ">
            Elite Auto Auction
          </Link>
        </div>

        <div className="hidden md:flex ml-38 mt-3 space-x-10">
          <Link
            to="#"
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
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            About Us
          </Link>

          <Link
            to="#"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Contact Us
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex ml-40 space-x-10">

          <button className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6" />
          </button>

          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700 flex mt-2" />
          </Link>

          <SearchBar />
        </div>
      </nav>
      <hr />
    </>
  );
};

export default Navbar;
