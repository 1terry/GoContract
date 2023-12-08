import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CalendarComponent from './Calendar';
import AddServiceForm from './AddServiceForm';

const ServiceRegistryClient = () => {
  const [serviceName, setServiceName] = useState('');
  const [serviceURL, setServiceURL] = useState('');
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    fetchServicesList();
  }, []); // Fetch services on component mount

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Calendar':
        return <CalendarComponent />;
      case 'AddService':
        return <AddServiceForm/>
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