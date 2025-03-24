import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
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


const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="text-center mt-10">
              <h1>Welcome to My App</h1>
              <Link to="/signup" className="text-blue-600 underline">
                Go to Signup
              </Link>{" "}
              |{" "}
              <Link to="/login" className="text-blue-600 underline">
                Go to Login
              </Link>{" "}
              |{" "}
              <Link to="/register-vehicle" className="text-blue-600 underline">
                Register Vehicle
              </Link>
            </div>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register-vehicle" element={<VehicleForm />} /> {/* Vehicle Registration Route */}

        <Route path="/" element={<Home />}></Route>
        <Route path="/scoreboard" element={<ScoreboardPopup />}></Route>
        <Route path="/admin/scoreboard" element={<ScoreboardPopup />}></Route>

        <Route path="/admin/sellers" element={<SellerScoreboard />}></Route>
        <Route path="/admin/buyers" element={<BuyerScoreboard />}></Route>
        <Route path="/profile" element={<UserProfile />}></Route>
        <Route path="/admin/" element={<AdminDashboard />}></Route>
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/profile" element={<Settings />}></Route>
        <Route path="/admin/admin" element={<AdminDashboard />}></Route>
        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/admin/chart" element={<ChartAdmin />}></Route>
        <Route path="/user" element={<UserDetailsPage />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
