import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import AdminLogin from "./component/admin/AdminLogin.jsx";
import Scoreboard from "./pages/Scoreboard.jsx";

const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAdminLoggedIn") === "true";
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        {/* <Route path="/scoreboard" element={<ScoreboardPopup />} /> */}
        <Route path="/admin/scoreboard" element={<ScoreboardPopup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/user" element={<UserDetailsPage />} />
        <Route path="/scoreboard" element={<Scoreboard />} />

        
        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Routes */}
        <Route path="/admin/" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/sellers" element={
          <ProtectedAdminRoute>
            <SellerScoreboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/buyers" element={
          <ProtectedAdminRoute>
            <BuyerScoreboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedAdminRoute>
            <Settings />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedAdminRoute>
            <Settings />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/admin" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
        <Route path="/admin/chart" element={
          <ProtectedAdminRoute>
            <ChartAdmin />
          </ProtectedAdminRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;