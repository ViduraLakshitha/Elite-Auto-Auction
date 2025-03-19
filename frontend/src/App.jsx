import React from "react";
import SellerScoreboard from "./component/SellerScoreboard.jsx";
import BuyerScoreboard from "./component/BuyerScoreboard.jsx";
import UserProfile from "./component/UserProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import "./App.css";
import "./UserProfile.css";
import "./AdminDashboard.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
