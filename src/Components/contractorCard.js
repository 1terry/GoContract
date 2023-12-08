// src/routes/Home.js
import React from 'react';
import './contractorCard.css'; // Import the CSS file

function ContractorCard({firstName, lastName}) {
  return (
    
    <div className='formatCard'>
        <p>First Name: {firstName}</p>
        <p>Last Name: {lastName}</p>
        <div>
            <button> Booking </button>
            <button> Rate </button>
        </div>


    </div>
  );
};

export default ContractorCard;
