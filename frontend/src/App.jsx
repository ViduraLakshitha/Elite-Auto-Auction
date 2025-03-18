import React from "react";
import SellerScoreboard from "./component/SellerScoreboard.jsx";
import BuyerScoreboard from "./component/BuyerScoreboard.jsx";
import UserProfile from "./component/UserProfile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import "./App.css";
import "./UserProfile.css";
import "./AdminDashboard.css";

const App = () => {
  return (
    <div className="App">
      <h1>Classic & Luxurious Vehicle Auction System</h1>
      <div className="scoreboard">
      <SellerScoreboard />
      <BuyerScoreboard />
    </div> 
    <div className="user-profile-container">  
      <UserProfile />
    </div>
    <div className="admin-dashboard-container">
      <AdminDashboard />
    </div>
     
    </div>
  );
};

export default App;
