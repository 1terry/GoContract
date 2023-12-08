// src/components/ContractoruserData.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ContractorProfile() {
  const { userData, setUserData } = useAuth(); // Destructure setUserData from AuthContext
  const [canManageTrades, setCanManageTrades] = useState(userData.canManageTrades);
  const [canManageBookings, setCanManageBookings] = useState(userData.canManageBookings);
  const navigate = useNavigate();

  const handleCheckboxChange = async (event) => {
    const { name, checked } = event.target;
  
    // Update local state
    if (name === 'canManageTrades') {
      setCanManageTrades(checked);
    } else if (name === 'canManageBookings') {
      setCanManageBookings(checked);
    }
  
    // Prepare the payload for the update request using the 'checked' value directly
    const updatedData = {
      ...userData, // include other profile data if necessary
      canManageTrades: name === 'canManageTrades' ? checked : canManageTrades,
      canManageBookings: name === 'canManageBookings' ? checked : canManageBookings,
    };
  
    // Send the update request to the server
    try {
        const response = await fetch('/updateUserProfile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ docId: userData._id, updates: updatedData }),
          });
          
  
      if (!response.ok) {
        throw new Error('Profile update failed');
      }
      if (response.ok) {
        const updatedUserData = { ...userData, ...updatedData };
        setUserData(updatedUserData); // Update userData in AuthContext
        // Show success message or any other post-update logic
      }
  
      // Handle the response here, e.g., show a success message
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle the error here, e.g., show an error message
    }
  };
  
  // Inside ContractorProfile component

const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This cannot be undone.");
    if (confirmDelete) {
      try {
        const response = await fetch(`/deleteUserAccount?docId=${userData._id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete account');
        }
  
        // Log the user out and navigate to the main page
        setUserData({}); // Clear user data
        navigate('/login'); // Navigate to the main page (or login page)
      } catch (error) {
        console.error('Error deleting account:', error);
        // Handle the error here
      }
    }
  };
  
  return (
    <div>
      <button onClick={() => navigate('/contractorDashboard')}>Back</button>

      <h2>My Profile</h2>
      <p><strong>First Name:</strong> {userData.firstName}</p>
      <p><strong>Last Name:</strong> {userData.lastName}</p>
      <p><strong>Address:</strong> {userData.address}</p>
      <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
      <p><strong>Email:</strong> {userData.username}</p>
      <h3>Services:</h3>
      <label>
        <input
          type="checkbox"
          name="canManageTrades"
          checked={canManageTrades}
          onChange={handleCheckboxChange}
        />
        Can Manage Trades
      </label>
      <br/>
      <label>
        <input
          type="checkbox"
          name="canManageBookings"
          checked={canManageBookings}
          onChange={handleCheckboxChange}
        />
        Can Manage Bookings
      </label>
      <br></br>
      <button onClick={handleDeleteAccount}>Delete Account</button>

    </div>
  );
}

export default ContractorProfile;
