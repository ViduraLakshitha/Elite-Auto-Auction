import React from 'react'
import { useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';

const SearchBar = () => {
      const [searchTerm, setSearchTerm] = useState("");
      const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {isOpen ? (<form></form>) : (
            <button>
                  <HiMagnifyingGlass className='h-6 w-6 ' />
            </button>
      )}
    </div>
  )
}

export default SearchBar