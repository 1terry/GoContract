// src/components/ContractorDashboard.js
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CalendarComponent from './Calendar';

function ContractorDashboard() {
  const { userData } = useAuth();
  const navigate = useNavigate();

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <nav>{/* Your nav elements */}</nav>
      <div><h1>Hello {userData.firstName}!</h1></div>

      {userData.canManageBookings && (
        <button class='btn btn-primary' onClick={() => navigate("/manageBookings")}>
          Manage Bookings
        </button>
      )}
      {userData.canManageTrades && (
        <button  class='btn btn-primary'onClick={() => navigate("/manageTrades")}>Manage Trades</button>
      )}
      <button  class='btn btn-primary'onClick={() => navigate("/contractorProfile")}>My Profile</button>
      {userData.canManageCalendar && (
        <CalendarComponent/>
      )}
      
    </div>
  );
}

export default ContractorDashboard;
