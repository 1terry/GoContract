import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from './Navigation';

function ConditionalNavigation() {
    const location = useLocation();
    const { isAuthenticated } = useAuth(); // Use the authentication state

    if (isAuthenticated || location.pathname === '/contractorDashboard' || location.pathname === '/dashboard' || location.pathname === '/bookings' || location.pathname === '/ratingForm') {
        return null; // Hide Navigation if authenticated or on contractorDashboard
    }
    return <Navigation />;
}

export default ConditionalNavigation;
