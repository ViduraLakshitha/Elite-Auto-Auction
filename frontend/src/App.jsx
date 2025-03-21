import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SellerScoreboard from "./component/SellerScoreboard.jsx";
import BuyerScoreboard from "./component/BuyerScoreboard.jsx";
import ScoreboardPopup from "./component/ScoreboardPopup.jsx";
import UserProfile from "./component/UserProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Settings from "./component/admin/Settings.jsx";
import PaymentPage from "./component/payment/PaymentPage.jsx";
import "./App.css";
import "./UserProfile.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/admin/sellers" element={<SellerScoreboard />}></Route>
        <Route path="/admin/buyers" element={<BuyerScoreboard />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/admin/" element={<AdminDashboard />}></Route>
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/admin" element={<AdminDashboard />}></Route>
        <Route path="/payments" element={<PaymentPage />} />
        {/* <Route path="/profile/" element={<Settings />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
