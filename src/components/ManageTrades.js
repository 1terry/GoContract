import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AddServiceForm from "./AddServiceForm"; // Import the new component

function ManageTrades() {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const [trades, setTrades] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Define the fetchTrades function
  const fetchTrades = async () => {
    try {
      const response = await fetch(
        `/getContractorTrades?userId=${userData.userId}`
      );
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
      const response = await fetch(`/deleteTrade?tradeId=${tradeId}`, {
        method: "DELETE"
      });
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
      <button onClick={() => navigate("/contractorDashboard")}>
        Back to Dashboard
      </button>
      <h2>Manage Trades</h2>
      <button onClick={() => setShowForm(true)}>Add a Trade</button>
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
            <p>Listed On: {trade.createdAt}</p>
            <button onClick={() => handleDelete(trade._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageTrades;
