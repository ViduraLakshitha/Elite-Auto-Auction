import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auction from "./pages/Auction";
import AuctionList from "./pages/AuctionList"; // Import your AuctionList component
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";

function App  ()  {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/auction-details/:id" element={<Auction/>}/>
        <Route path="/auctions" element={<AuctionList />} /> 
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
