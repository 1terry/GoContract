import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import SignUp from './components/signup';
import Navigation from './components/Navigation';
import CalendarComponent from './components/Calendar';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calendar" element={<CalendarComponent />} />
        {/* Additional routes can be added here */}
      </Routes>
    </Router>
  );
}

export default App;
