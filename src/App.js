import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import SignUp from "./components/signup";
import Navigation from "./components/Navigation";
import Invoice from "./components/invoice";
import Data from "./tempData.json";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/invoice" element={<Invoice data={Data}></Invoice>} />
        {/* Additional routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;
