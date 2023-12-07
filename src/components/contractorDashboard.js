import React from 'react';
import { useAuth } from '../context/AuthContext';

function ContractorDashboard() {
  const { userData } = useAuth();
  console.log(userData);
  // Check if userData is available before trying to access its properties
  if (!userData) {
    // Render a loading message or alternative content until userData is available
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <nav>
        {/* Your nav elements */}
      </nav>
      {/* Safely access userData properties since userData is confirmed to be available */}
      <div>User ID: {userData.userId}</div>
    </div>
  );
}

export default ContractorDashboard;
