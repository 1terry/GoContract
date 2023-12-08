import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from 'react-router-dom';

function BookingForm() {
  const { state } = useLocation();
  const { userData } = useAuth();

  // Destructure values from state or provide default values
  const { contractorName = '', contractorId = '' } = state || {};

  const [date, setDate] = useState("");
  const [typeOfService, setTypeOfService] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(state);
      console.log(contractorId);
      console.log(userData.userId);
      console.log('date');
      console.log(typeOfService);
      console.log(serviceDetails);
      console.log(contractorName);
      var clientName =userData.firstName + " " + userData.lastName;
      console.log(clientName);

      const response = await fetch('http://localhost:3001/addBooking', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractorId: contractorId,
          // contractorName: contractorName,
          contractorName: 'big benis',
          clientName: userData.firstName + " " + userData.lastName,
          clientId: userData.userId,
          date: 'date with nazim uwu',
          typeOfService: typeOfService,
          serviceDetails: serviceDetails,
          status: false,
        }),
      });
      
      console.log(response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Booking added", result);
    } catch (error) {
      console.error("Error submitting booking", error);
    }

    setTypeOfService("");
    setServiceDetails("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Booking with {contractorName}</h1>
        <label>
          Select Date:
          <button>Open Calendar</button>
        </label>
        <br></br>
        <label>
          Type of Service Request
          <input
            type="text"
            value={typeOfService}
            onChange={(e) => setTypeOfService(e.target.value)}
            required
          />
        </label>
        <br></br>
        <label>
          Details of Request
          <textarea
            value={serviceDetails}
            onChange={(e) => setServiceDetails(e.target.value)}
          ></textarea>
        </label>
        <br></br>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default BookingForm;
