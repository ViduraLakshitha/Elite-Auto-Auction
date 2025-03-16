import React from "react";
import { BrowserRouter, Routes,Route } from "react-router-dom";
import UserLayout from "./component/layout/UserLayout";

const App = () => {
  return(
    <BrowserRouter>
    <Routes>

      <Route path = "/" element = {<UserLayout/>}> {/* User Layout*/ } </Route>

    </Routes>
    </BrowserRouter>
  );
};

export default App;
