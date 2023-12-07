import React, { useState } from "react";

import { useAuth } from "../context/AuthContext";

function BookingForm({ contractorName, contractorId }) {
  const { userData } = useAuth();

  const [date, setDate] = useState("");
  const [typeOfService, setTypeOfService] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(contractorId);
      console.log(userData.userId);
      console.log(date);
      console.log(typeOfService);
      console.log(serviceDetails);
      const response = await fetch("/addBooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractorId: contractorId,
          clientId: userData.userId,
          date: date,
          typeOfService: typeOfService,
          serviceDetails: serviceDetails,
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
