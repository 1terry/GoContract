import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './components/login';
// import SignUp from './components/signup';
import Navigation from './components/Navigation'; // Import the navigation component
import Dashboard from './components/dashboard';

function App() {
  return (
    <Router>
      <Navigation /> {/* Include the navigation component */}
      <Routes>

        <Route path="/" element={<Dashboard />} />

        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
