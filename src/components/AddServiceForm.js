// src/components/AddServiceForm.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


function AddServiceForm({ onClose, onServiceAdded }) {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch events from your database
    fetchEvents();
  }, []); // Empty dependency array ensures the effect runs once on component mount

  const fetchEvents = async () => {
    try {
      setServiceName("AddService")
      const service = await fetch(`http://localhost:3002/services`);
      const Data = await service.json();
      console.log('Received data:', Data);
      // Assuming data is an array, filter based on serviceName
      const ServiceData = Data.services.filter(service => service.serviceName == 'AddService');
      console.log(ServiceData[0].serviceURL)
      if (!ServiceData || ServiceData.length === 0) {
        console.error('Service unavailable');
        return;
      }
      setServices(ServiceData)
    } catch (error) {
      console.error('Error fetching service:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${services[0].serviceURL}/addService`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          trade: serviceTitle,
          description: serviceDescription,
          contractorId: userData.userId, // Assuming userData contains userId
          contractorName: userData.firstName.concat(" ", userData.lastName)
        })
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Service added:", result);
      onServiceAdded();
      onClose(); // Close form on successful submission
    } catch (error) {
      console.error("Error submitting service:", error);
    }

    setServiceDescription("");
    setServiceTitle("");
  };

  return (
    <div>
      {!services || services.length === 0? (
        <div>
          <button onClick={() => navigate('/contractorDashboard')}>Back</button>
          <h2>Service not available.</h2>
        </div>
      ) : (
        <>
        <button onClick={() => navigate('/contractorDashboard')}>Back</button>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title:
              <input type="text" value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Description:
              <textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)}></textarea>
            </label>
          </div>
          <button type="submit">Submit Service</button>
        </form>
        </>
      )}
    </div>
  );
}

export default AddServiceForm;
