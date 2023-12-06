import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import SignUp from './components/signup';
import Navigation from './components/Navigation';
import Dashboard from './components/dashboard';
import "./App.css";
import ContractorData from "./TempData.json";
import ContractorCard from './components/contractorCard';

function App() {
  return (
    // <div className="App">
    //   <label>Looking for a contractor? Search below!</label>
    //   <SearchBar
    //     placeholder="Enter a contractor name"
    //     data={ContractorData}
    //   ></SearchBar>
    // </div>
    <Router>
      <Navigation />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/ContractorCard" element={<ContractorCard/>} />

        {/* Additional routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;
