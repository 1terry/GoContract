// src/components/AddServiceForm.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AddServiceForm({ onClose }) {
  const { userData } = useAuth();
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/addService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: serviceTitle,
          description: serviceDescription,
          userId: userData.userId // Assuming userData contains userId
        }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Service added:', result);
      onClose(); // Close form on successful submission
    } catch (error) {
      console.error('Error submitting service:', error);
    }

    setServiceDescription("");
    setServiceTitle("");
  };

  return (
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
      <button onClick={() =>onClose()}>Cancel</button>
    </form>
  );
}

export default AddServiceForm;
