import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import ContractorCard from './contractorCard';

function Dashboard() {
  const [showContractorCard, setShowContractorCard] = useState(false);
  const [contractorName, setContractorName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSearchClick = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      console.log('Sending:', { username: contractorName });

      const response = await fetch('http://localhost:3001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: contractorName }),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 201) {
        console.log('Query Successful', data);
        setMessage('Query Successful!');
        // Redirect or handle success scenario
        setShowContractorCard(true);
      } else {
        console.error('Query Failed:', contractorName);
        setMessage(data.message || 'Query Failed');
      }
    } catch (error) {
      console.error('Error during Query', error);
      setMessage('An error occurred during Query');
    }
  };

  return (
    <form onSubmit={handleSearchClick} className='container-search'>
      <h2>Search</h2>
      {message && <div>{message}</div>}
      <label>
        Search for contractor
        <input 
          type="text" 
          value={contractorName} 
          onChange={(e) => setContractorName(e.target.value)} 
        />
      </label>
      <button type="submit">Search</button>

      {showContractorCard && <ContractorCard />}
    </form>
  );
}

export default Dashboard;
