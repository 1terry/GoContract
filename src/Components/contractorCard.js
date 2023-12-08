import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './contractorCard.css';

function ContractorCard({ firstName, lastName, contractorId }) {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleBookingClick = () => {
    // Handle button click and navigate to '/dashboard'
    var contractorName = firstName + " " + lastName;
    console.log(contractorName, contractorId);
    navigate('/bookings', { state: { contractorName: contractorName, contractorId: contractorId } });
  };

  const handleRateClick = () => {
    var contractorName = firstName + " " + lastName;
    navigate('/ratingForm', { state : { contractorName: contractorName, contractorId: contractorId}})
  }

  return (
    <div className='formatCard'>
      <p>First Name: {firstName}</p>
      <p>Last Name: {lastName}</p>
      <div>
        <button onClick={handleBookingClick}>Booking</button>
        <button onClick={handleRateClick}>Rate</button>
      </div>
    </div>
  );
}

export default ContractorCard;
