// src/components/ContractorDashboard.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddServiceForm from './AddServiceForm'; // Import the new component

function ContractorDashboard() {
  const { userData } = useAuth();
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
    </div>
  );
}

export default ContractorDashboard;
