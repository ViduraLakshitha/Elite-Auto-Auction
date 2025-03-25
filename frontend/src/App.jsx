import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SellerScoreboard from "./component/scoreboard/SellerScoreboard.jsx";
import BuyerScoreboard from "./component/scoreboard/BuyerScoreboard.jsx";
import ScoreboardPopup from "./component/scoreboard/ScoreboardPopup.jsx";
import UserProfile from "./component/user/UserProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Settings from "./component/admin/Settings.jsx";
import PaymentPage from "./component/payment/PaymentPage.jsx";
import ChartAdmin from "./component/admin/ChartAdmin.jsx";
import UserDetailsPage from "./component/user/UserDetailsPage.jsx";

// Import missing components
import Signup from "./pages/Signup.jsx"; 
import Login from "./pages/Login.jsx"; 
import Dashboard from "./pages/Dashboard.jsx"; 
import VehicleForm from "./pages/VehicleForm.jsx"; 
import VehicleList from "./component/user/VehicleList.jsx"; // ✅ Import VehicleList


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Route (Main Page) */}
        <Route path="/" element={<Home />} />

        {/* Authentication Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard & User Management */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/user" element={<UserDetailsPage />} />

        {/* Vehicle Related Routes */}
        <Route path="/register-vehicle" element={<VehicleForm />} />
        <Route path="/vehicles" element={<VehicleList />} />

        

        {/* Scoreboards */}
        <Route path="/scoreboard" element={<ScoreboardPopup />} />
        <Route path="/admin/scoreboard" element={<ScoreboardPopup />} />
        <Route path="/admin/sellers" element={<SellerScoreboard />} />
        <Route path="/admin/buyers" element={<BuyerScoreboard />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/chart" element={<ChartAdmin />} />

        {/* Payments */}
        <Route path="/payments" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
};

export default App;
