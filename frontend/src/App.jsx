import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";;
import UserProfile from "./component/user/UserProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Settings from "./component/admin/Settings.jsx";
import PaymentPage from "./component/payment/PaymentPage.jsx";
import ChartAdmin from "./component/admin/ChartAdmin.jsx";
import UserDetailsPage from "./component/user/UserDetailsPage.jsx";
import AdminLogin from "./component/admin/AdminLogin.jsx";
import Scoreboard from "./pages/Scoreboard.jsx";

// Import missing components
import Signup from "./pages/Signup.jsx"; 
import Login from "./pages/Login.jsx"; 
import Dashboard from "./pages/Dashboard.jsx"; 
import VehicleForm from "./pages/VehicleForm.jsx"; 
import VehicleList from "./component/user/VehicleList.jsx"; //Import VehicleList
import PaymentForm from "./pages/PaymentForm.jsx";
import TransportationRegistration from "./pages/TransportationRegistration.jsx"; // Import TransportationRegistration
import TransportationManagementPage from "./pages/TransportationManagement.jsx"; // Import Transportation Management

const ProtectedAdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAdminLoggedIn") === "true";
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};
//import { BrowserRouter, Routes, Route } from "react-router-dom";
//import Home from "./pages/Home";
import Auction from "./pages/Auction";
import PaymentPortal from "./pages/PaymentPortal";
import AuctionsAll from "./pages/AuctionsAll";
import AuctionList from "./pages/AuctionList"; // Import your AuctionList component
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";

function App  ()  {
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

        {/* Transportation Related Routes */}
        <Route path="/register-transportation" element={<TransportationRegistration />} />

        {/* Scoreboards */}
        {/* <Route path="/scoreboard" element={<ScoreboardPopup />} /> */}
        

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/chart" element={<ChartAdmin />} />
        <Route path="/admin/transportation" element={<TransportationManagementPage />} />

        {/* Payments */}
        <Route path="/payment" element={<PaymentForm />} />
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
        <Route path="/admin/transportation" element={
          <ProtectedAdminRoute>
            <TransportationManagementPage />
          </ProtectedAdminRoute>
        } />
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/auction-details/:id" element={<Auction/>}/>
        <Route path="/payment" element={<PaymentPortal />} />
        <Route path="/auctions-all" element={<AuctionsAll/>}/>
        <Route path="/auctions" element={<AuctionList />} /> 
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  );
};

export default App;