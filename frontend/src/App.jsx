import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auction from "./pages/Auction";

function App  ()  {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/auction-details/:id" element={<Auction/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
