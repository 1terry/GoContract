import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './dashboard.css'; // Import the CSS file
import ContractorCard from './contractorCard';
import SearchBar from './SearchBar'; // Adjust the path accordingly

function Dashboard() {
  const [showContractorCard, setShowContractorCard] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function



  const handleSearchClick = () => {
    // Perform any search logic here
   
    

    // Navigate to the contractorCard route
    setShowContractorCard(true);
  };

  return (
    <div className="container-search">
      <h1>Looking for a contractor? Search below!</h1>


      {/* <input
        type="text"
        placeholder={placeholder}
        value={searchWord}
        onChange={handleChange}
      />
      <button onClick={handleFilter}>Search</button>
      {filteredData.map((item) => (
        <div key={item.id}>{item.contractorName}</div>
      ))} */}


      {/* <div className="Search-part">
        <input className="format" type="text" placeholder="Search here" />
        <button onClick={handleSearchClick}>Search for kohei</button>      
        {/* <SearchBar placeholder="Search for contractors"/> */}


      {showContractorCard && <ContractorCard />}


    </div>
  );
}

export default Dashboard;
