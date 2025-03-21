import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import VehicleForm from "./component/VehicleForm"; // Import VehicleForm

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
      </Routes>
    </Router>
  );
};

export default App;
