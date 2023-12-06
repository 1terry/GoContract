import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import SignUp from './components/signup';
import Navigation from './components/Navigation';
import Dashboard from './components/dashboard';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard/>} />

        {/* Additional routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;
