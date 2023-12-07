import React, { useState, useEffect } from 'react';

const ServiceRegistryClient = () => {
  const [serviceName, setServiceName] = useState('');
  const [serviceURL, setServiceURL] = useState('');
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServicesList();
  }, []); // Fetch services on component mount

  const registerService = async () => {
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceName, serviceURL }),
      });

      if (response.ok) {
        // Refresh the services list after successful registration
        fetchServicesList();
        setServiceName('');
        setServiceURL('');
      } else {
        console.error('Failed to register service');
      }
    } catch (error) {
      console.error('Error registering service:', error);
    }
  };

  const fetchServicesList = async () => {
    try {
      const response = await fetch('http://localhost:3001/services');
      const data = await response.json();
      console.log('Response data:', data);
      setServices(data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  return (
    <div>
      <h2>Registered Services</h2>
      <ul>
        {services.map((service) => (
            <li key={service.serviceName}>{`${service.serviceName}: ${service.serviceURL}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceRegistryClient;