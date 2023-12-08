import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './contractorCard.css';

function ContractorCard({ firstName, lastName, contractorId }) {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleButtonClick = () => {
    // Handle button click and navigate to '/dashboard'
    var fullName = firstName + " " + lastName;
    console.log(fullName, contractorId);
    navigate('/bookings', { state: {fullName, contractorId } });
  };

  return (
    <div className='formatCard'>
      <p>First Name: {firstName}</p>
      <p>Last Name: {lastName}</p>
      <div>
        <button onClick={handleButtonClick}>Booking</button>
        <button>Rate</button>
      </div>
    </div>
  );
}

export default ContractorCard;
