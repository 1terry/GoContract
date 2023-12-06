// src/routes/Home.js
import React from 'react';
import './dashboard.css'; // Import the CSS file

function Dashboard() {
  return (
    <div className="container-search">
      <h1>Looking for a contractor? Search below!</h1>
      <input className="format" type="text" placeholder="Search here" />
    </div>
  );
};

export default Dashboard;
