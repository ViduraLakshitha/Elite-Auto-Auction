import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auction from "./pages/Auction";
import PaymentPortal from "./pages/PaymentPortal";
import AuctionsAll from "./pages/AuctionsAll";

function App  ()  {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/auction-details/:id" element={<Auction/>}/>
        <Route path="/payment" element={<PaymentPortal />} />
        <Route path="/auctions-all" element={<AuctionsAll/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
