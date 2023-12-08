import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CalendarComponent from './Calendar';
import AddServiceForm from './AddServiceForm';
import { useNavigate } from 'react-router-dom';

const ServiceRegistryClient = () => {
  const [serviceName, setServiceName] = useState('');
  const [serviceURL, setServiceURL] = useState('');
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServicesList();
  }, []); // Fetch services on component mount

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Calendar':
        return (<button onClick={() => navigate('/calendar')}>Calendar</button>)
      case 'AddService':
        return (<button onClick={() => navigate('/AddServiceForm')}>Add Service Form</button>)
      case 'ManageBookings':
        return (<button onClick={() => navigate('/manageBookings')}>Manage Bookings</button>)
      case 'ManageTrades':
        return (<button onClick={() => navigate('/manageTrades')}>Manage Trades</button>)
      case 'Invoice':
        return (<button onClick={() => navigate('/manageBookings')}>Invoice</button>)
      default:
        return <div></div>;
    }
  };

  const fetchServicesList = async () => {
    try {
      const response = await fetch('http://localhost:3002/services');
      const data = await response.json();
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <div>
      <button onClick={() => navigate('/contractorDashboard')}>Back</button>
      <h2>Available Services</h2>
      <ul>
      {services.map((service) => (
        <li key={service.serviceName}>
          {`${service.serviceName}: `}
            <button onClick={() => setActiveTab(service.serviceName)}>Visit Service</button>
        </li>
      ))}
      </ul>
      {renderTabContent()}
    </div>
  );
};

export default ServiceRegistryClient;