import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import ContractorCard from './contractorCard';

function Dashboard() {
  const [showContractorCard, setShowContractorCard] = useState(false);
  const [contractorName, setContractorName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const [jsonData, setJsonData] = useState(''); // Added state to store JSON data


  const handleSearchClick = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      console.log('Sending:', { contractorName: contractorName });

      const response = await fetch('http://localhost:3001/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractorName: contractorName }),
      });

      const filterRelevantData = (data) => {
        const dataArray = Array.isArray(data) ? data : [data];

      
        const excludedKeys = ['_id', '_rev', 'firstName', 'lastName', 'password'];
      
        const filteredData = dataArray.map(user => {
          if (typeof user === 'object') {
            for (const key of excludedKeys) {
              delete user[key];
            }
            return user;
          }
          return {};
        });
      
        return filteredData;
      };
      
      
    
      const data = await response.json();

      console.log(data);
      // Now to format the data
      // Also send response status to update the query

      const filteredData = filterRelevantData(data);
      console.log('filtered data!: ', filteredData);
      setJsonData(JSON.stringify(data.users['username'], null, 2)); // Convert JSON to string with indentation

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

      <div>
        <p>JSON Data:</p>
        <pre>{jsonData}</pre>
        {/* <ContractorCard /> */}
      </div>
      {/* {showContractorCard && <ContractorCard />} */}
    </form>
  );
}

export default Dashboard;
