import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider} from './context/AuthContext';
import Login from './components/login';
import SignUp from './components/signup';
import ContractorDashboard from './components/contractorDashboard';
import ConditionalNavigation from './components/conditionalNavigation';
import PrivateRoute from './components/PrivateRoute'; 
import Dashboard from './components/dashboard';
import Bookings from './components/BookingForm';
import CalendarComponent from './components/Calendar';
import RatingForm from './components/RatingForm';


function App() {
  return (
    <AuthProvider> {/* Wrap your routes with AuthProvider */}
      <Router>
        <ConditionalNavigation />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
          <Route path="/ratingForm" element={<PrivateRoute><RatingForm></RatingForm></PrivateRoute>} />

          <Route path="/contractorDashboard" element={<PrivateRoute><ContractorDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
