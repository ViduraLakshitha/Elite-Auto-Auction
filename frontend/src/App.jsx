import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./pages/Home";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          {" "}
          {/* User Layout*/}{" "}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
