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
      {/* <button onClick={() => setShowForm(true)}>Add a Service</button>
      {showForm && (
        <AddServiceForm onClose={() => setShowForm(false)} />
      )} */}
      {renderTabContent()}
    </div>
  );
}

export default ContractorDashboard;