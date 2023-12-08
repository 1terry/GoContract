// src/components/ContractorDashboard.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ContractorDashboard() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <nav>
        {/* Your nav elements */}
      </nav>
      <div>Hello {userData.firstName}!</div>

      <button onClick={() => navigate('/manageBookings')}>Manage Bookings</button>
      <button onClick={() => navigate('/manageTrades')}>Manage Trades</button>
    </div>
  );
}

export default ContractorDashboard;