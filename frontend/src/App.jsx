import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auction from "./pages/Auction";
import AdminNotificationDashboard from "./pages/NotificationAdminDashboard";
import Notifications from "./pages/Notifications";

function App  ()  {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/auction-details/:id" element={<Auction/>}/>
        <Route path="/admin/notifications" element={<AdminNotificationDashboard />} />
        <Route path="/notifications/:id" element={<Notifications />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
