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
      <div>Hello {userData.firstName}!</div>

      {userData.canManageBookings && (
        <button onClick={() => navigate("/manageBookings")}>
          Manage Bookings
        </button>
      )}
      {userData.canManageTrades && (
        <button onClick={() => navigate("/manageTrades")}>Manage Trades</button>
      )}
      <button onClick={() => navigate("/contractorProfile")}>My Profile</button>
      {userData.canManageCalendar && (
        <CalendarComponent/>
      )}
      
    </div>
  );
}

export default ContractorDashboard;
