import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation } from 'react-router-dom';
import Calendar from "react-calendar";
import CalendarComponent from "./Calendar";
import 'react-calendar/dist/Calendar.css';
import './booking.css';

function BookingForm() {
  const { state } = useLocation();
  const { userData } = useAuth();
  const [showCalendar, setShowCalendar] = useState(false);

  // Destructure values from state or provide default values
  const { contractorName = '', contractorId = '' } = state || {};

  const [date, setDate] = useState("");
  const [typeOfService, setTypeOfService] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");

  const openCalendar = () => {
    setShowCalendar(true);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
  };

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
          contractorName: contractorName,
          // contractorName: 'big benis',
          clientName: userData.firstName + " " + userData.lastName,
          clientId: userData.userId,
          clientEmail: userData.username,
          date: "2023-12-08",
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
    <div className="containerBook">
      <div className="floatLeft">

      <form onSubmit={handleSubmit}>
      <h1>Booking with {contractorName}</h1>
      <hr></hr>
        <label>
          Select Date:
          <button type="button" onClick={openCalendar}>
            Open Calendar
          </button>
        </label>
        <br></br>
        <div >
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
        </div>
        <br></br>
        <button type="submit">Submit</button>
      </form>       
      </div>

      <div className="floatRight">
        {showCalendar && (
          <div>
            <CalendarComponent />
            <button type="button" onClick={closeCalendar}>
              Close Calendar
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <form onSubmit={handleSubmit}>
  //       <h1>Booking with {contractorName}</h1>
  //       <label>
  //         Select Date:
  //         <button type="button" onClick={openCalendar}>
  //           Open Calendar
  //         </button>
  //       </label>
  //       <br />
  //       {/* Other form elements */}
  //       <br />
  //       <button type="submit">Submit</button>
  //     </form>

  //     {/* Conditionally render CalendarComponent */}
  //     {showCalendar && (
  //       <div>
  //         <CalendarComponent />
  //         <button type="button" onClick={closeCalendar}>
  //           Close Calendar
  //         </button>
  //       </div>
  //     )}
  //   </div>
  // );
}

export default BookingForm;
