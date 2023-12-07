// src/components/ContractorDashboard.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddServiceForm from './AddServiceForm'; // Import the new component
import { useNavigate } from 'react-router-dom';

function ContractorDashboard() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <nav>
        {/* Your nav elements */}
      </nav>
      <div>Hello {userData.firstName}!</div>
      <button onClick={() => setShowForm(true)}>Add a Service</button>
      {showForm && (
        <AddServiceForm onClose={() => setShowForm(false)} />
      )}
      <button onClick={() => navigate('/manageBookings')}>Manage Bookings</button>
    </div>
  );
}

export default ContractorDashboard;
