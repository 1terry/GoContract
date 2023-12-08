// src/components/ContractorDashboard.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddServiceForm from './AddServiceForm';
import CalendarComponent from './Calendar';
import ServiceRegistryClient from './Registry';

function ContractorDashboard() {
  const { userData } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarComponent />;
      case 'registry':
        return <ServiceRegistryClient />;
      case 'service':
        return <AddServiceForm/>
      default:
        return <div></div>;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('home')}>Home</button>
        <button onClick={() => setActiveTab('registry')}>Services Provided</button>
      </nav>
      <div>Hello {userData.firstName}!</div>
    
      {userData.canManageBookings && (
        <button onClick={() => navigate('/manageBookings')}>Manage Bookings</button>
      )}
      {userData.canManageTrades && (
        <button onClick={() => navigate('/manageTrades')}>Manage Trades</button>
      )}
      <button onClick={() => navigate('/contractorProfile')}>My Profile</button>

    </div>
  );
}

export default ContractorDashboard;