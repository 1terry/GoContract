// src/components/ContractorDashboard.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddServiceForm from './AddServiceForm';
import CalendarComponent from './Calendar';
import ServiceRegistryClient from './Registry';
import { useNavigate } from 'react-router-dom';

function ContractorDashboard() {
  const { userData } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <nav>
        <button onClick={() => setActiveTab('home')}>Home</button>
        <button onClick={() => navigate('/registry')}>Services Provided</button>
        <button onClick={() => navigate('/contractorProfile')}>My Profile</button>
      </nav>
      <div>Hello {userData.firstName}!</div>
      <CalendarComponent />
    </div>
  );
}

export default ContractorDashboard;