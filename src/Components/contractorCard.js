import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './contractorCard.css';

function ContractorCard({ contractorName, contractorId, contractorTrade}) {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleBookingClick = () => {
    // Handle button click and navigate to '/dashboard'
    console.log(contractorName, contractorId);
    navigate('/bookings', { state: { contractorName: contractorName, contractorId: contractorId } });
  };

  const handleRateClick = () => {
    navigate('/ratingForm', { state : { contractorName: contractorName, contractorId: contractorId}})
  }

  return (
    <div className='formatCard'>
      <p><b>Name:</b> {contractorName}</p>
      <p><b>Trade:</b> {contractorTrade}</p>
      <div >
        <button className='btn btn-primary' onClick={handleBookingClick}>Booking</button>
        <button className='btn btn-primary' onClick={handleRateClick}>Rate</button>
      </div>
    </div>
  );
}

export default ContractorCard;
