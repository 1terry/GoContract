import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddServiceForm from "./AddServiceForm"; // Import the new component

function ManageTrades() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [services, setServices] = useState([]);

  // Define the fetchTrades function
  const fetchTrades = async () => {
    try {
      setServiceName("ManageTrades")
        const service = await fetch(`http://localhost:3002/services`);
        const Data = await service.json();
        // Assuming data is an array, filter based on serviceName
        const ServiceData = Data.services.filter(service => service.serviceName == 'ManageTrades');
        if (!ServiceData || ServiceData.length === 0) {
          console.error('Service unavailable');
          return;
        }
        setServices(ServiceData)
      const response = await fetch(`${ServiceData[0].serviceURL}/getContractorTrades?userId=${userData.userId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const tradesData = await response.json();

      if (Array.isArray(tradesData)) {
        setTrades(tradesData);
      } else {
        console.error("Expected an array of trades, but received:", tradesData);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };

  // Define the refreshTrades function
  const refreshTrades = () => {
    fetchTrades();
  };

  useEffect(() => {
    if (userData && userData.userId) {
      fetchTrades();
    }
  }, [userData, fetchTrades]);

  const handleDelete = async (tradeId) => {
    try {
      const response = await fetch(`${services[0].serviceURL}/deleteTrade?tradeId=${tradeId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error("Failed to delete trade");
      }

      // Update the state to remove the deleted trade
      setTrades((prevState) =>
        prevState.filter((trade) => trade._id !== tradeId)
      );
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  return (
    <div>
    {!services || services.length === 0? (
      <div>
        <button onClick={() => navigate('/contractorDashboard')}>Back</button>
        <h2>Service not available.</h2>
      </div>
      ) : (
        <>
        <button onClick={() => navigate('/contractorDashboard')}>Back to Dashboard</button>
      <h2>Manage Trades</h2>
      <button class="btn btn-success" onClick={() => setShowForm(true)}>Add a Trade</button>
      {showForm && (
        <AddServiceForm
          onClose={() => setShowForm(false)}
          onServiceAdded={refreshTrades}
        />
      )}
      <div>
        {trades.map((trade, index) => (
          <div key={index}>
            <h3>{trade.trade}</h3>
            <p>Details: {trade.description}</p>
            <p>Listed On: {trade.createdAt.split('T')[0]}</p>
            <button class="btn btn-danger" onClick={() => handleDelete(trade._id)}>Delete</button>
          </div>
        ))}
      </div>
      </>
    )}
    </div>
  );
}

export default ManageTrades;
