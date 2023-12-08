import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import ContractorCard from "./contractorCard";

function Dashboard() {
  const [showContractorCard, setShowContractorCard] = useState(false);
  const [contractorName, setContractorName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [jsonData, setJsonData] = useState(""); // Added state to store JSON data
  const [passedData, setCardData] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  const handleSearchClick = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      console.log("Sending:", { contractorName: contractorName });

      let response;
      if (selectedOption === "byName") {
        response = await fetch("http://localhost:3001/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ contractorName: contractorName })
        });
      } else {
        response = await fetch("http://localhost:3001/searchTrade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ contractorName: contractorName })
        });
      }

      if (!response.ok) {
        throw new Error(`Query failed with status: ${response.status}`);
      }

      const data = await response.json();

      console.log(data);
  
      // Check if 'users' is an array in the response
      if (Array.isArray(data.users)) {
        // Extract usernames from the array
        const contractorName = data.users.map((user) => user.contractorName);
        const contractorId = data.users.map((user) => user.contractorId);
        const trade = data.users.map((user) => user.trade);

        // Update jsonData with the array of usernames
        setJsonData(JSON.stringify(contractorName, null, 2));

        console.log("Number of users: ", contractorName.length);

        const contractorCards = contractorName.map((user, index) => (
          <ContractorCard
            key={index}
            contractorName={contractorName[index]}
            contractorTrade={trade[index]}
            contractorId={contractorId[index]}
          />
        ));

        console.log("Contractor Cards", contractorCards);

        setCardData(contractorCards);
        console.log("Contractor Cards data", contractorCards);

        if (response.status === 201) {
          console.log("Query Successful", data);
          setMessage("Query Successful!");
          setShowContractorCard(true);
        } else {
          console.error("Query Failed:", contractorName);
          setMessage(data.message || "Query Failed");
        }
      } else {
        console.error("Invalid response format. Expected an array of users.");
        setMessage("Invalid response format");
      }
    } catch (error) {
      console.error("Error during Query", error);
      setMessage("An error occurred during Query");
    }
  };

  return (
    <form onSubmit={handleSearchClick} className='container-search'>
      <div className='searchHeader'>
        <h2>Search</h2>
        {/* {message && <div>{message}</div>} */}
        <label>
          <input 
            type="text" 
            value={contractorName} 
            onChange={(e) => setContractorName(e.target.value)} 
            placeholder='Search here'
          />
        </label>
        <label><input type="radio" name="options" value="byName" checked={selectedOption === "byName"} onChange={handleRadioChange}/>Search by Name</label>
        <label><input type="radio" name="options" value="byType" checked={selectedOption === "byType"} onChange={handleRadioChange}/>Search by Trade Type</label>

        <button type="submit" class="btn btn-success">Search</button>
      </div>
      <button onClick={handleLogout}>Logout</button>

      <div className='searchBar'>
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
