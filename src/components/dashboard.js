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
  const [passedData, setCardData] = useState('');

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
  
      if (!response.ok) {
        throw new Error(`Query failed with status: ${response.status}`);
      }
  
      const data = await response.json();
  
      console.log(data);
  
      // Check if 'users' is an array in the response
      if (Array.isArray(data.users)) {
        // Extract usernames from the array
        const usernames = data.users.map(user => user.firstName + ' ' + user.lastName);
        const firstNames = data.users.map(user => user.firstName);
        const lastNames = data.users.map(user => user.lastName);
        const contractorId = data.users.map(user => user._id);


        // Update jsonData with the array of usernames
        setJsonData(JSON.stringify(usernames, null, 2));
  
        console.log('Number of users: ', usernames.length);
        // for (var i = 0; i < usernames.length; i++){
        //   console.log("showing card: ", firstNames[i], lastNames[i]);
        //   <ContractorCard
        //     firstName={firstNames[i]}
        //     lastName={lastNames[i]}
        //   />
        // }
        const contractorCards = usernames.map((user, index) => (
          <ContractorCard
          key={index}
          firstName = {firstNames[index]}
          lastName = {lastNames[index]}
          />
        ));

        console.log("Contractor Cards", contractorCards);

        setCardData(contractorCards);
        console.log("Contractor Cards data", contractorCards);

        if (response.status === 201) {
          console.log('Query Successful', data);
          setMessage('Query Successful!');
          setShowContractorCard(true);
        } else {
          console.error('Query Failed:', contractorName);
          setMessage(data.message || 'Query Failed');
        }
      } else {
        console.error('Invalid response format. Expected an array of users.');
        setMessage('Invalid response format');
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
        {/* <p>JSON Data:</p> */}
        {/* <pre>{jsonData}</pre> */}
        <pre>{passedData}</pre>
        {/* <ContractorCard /> */}
      </div>
      {showContractorCard}
    </form>
  );
}

export default Dashboard;
