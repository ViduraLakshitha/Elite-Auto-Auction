import React from "react";
import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXCircle, HiMiniXMark } from "react-icons/hi2";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // const handleSearchToggle = () => {
  //   setIsOpen(!isOpen);
  // };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("search Term: ", searchTerm);
    setIsOpen(false);
  }

  return (
    <div>
      {/* {isOpen ? ( */}
        <form onSubmit={handleSearch}
        className="relative flex items-center justify-center w-full">
          <div>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
            />

            {/* Search icon for search */}

            <button
              type="submit"
              className="absolute right-1/50 top-2 transform-translate-y-2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>

          {/* close button */}
          {/* <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute -right-1/12 top-2.5 transform-translate-y-1/2 text-gray-600 hover:text-gray-800"
          >
            <HiMiniXMark className="h-5 w-5" />
          </button> */}
        </form>
      {/* ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6  flex mt-2" />
        </button>
      )} */}
    </div>
  );
};

export default SearchBar;
