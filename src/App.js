import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider} from './context/AuthContext';
import Login from './components/login';
import SignUp from './components/signup';
import ContractorDashboard from './components/contractorDashboard';
import ConditionalNavigation from './components/conditionalNavigation';
import PrivateRoute from './components/PrivateRoute'; 
import Navigation from './components/Navigation';
import AddServiceForm from './components/AddServiceForm';
import CalendarComponent from './components/Calendar';
import ManageBookings from './components/ManageBookings'; 
import ManageTrades from './components/ManageTrades';

function App() {
  return (
    <AuthProvider> {/* Wrap your routes with AuthProvider */}
      <Router>
        <ConditionalNavigation />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/calendar" element={<PrivateRoute><CalendarComponent /></PrivateRoute>} />
          <Route path="/AddServiceForm" element={<PrivateRoute><AddServiceForm /></PrivateRoute>} />
          <Route path="/contractorDashboard" element={<PrivateRoute><ContractorDashboard /></PrivateRoute>} />
          <Route path="/manageBookings" element={<PrivateRoute><ManageBookings /></PrivateRoute>} />
          <Route path="/manageTrades" element={<PrivateRoute><ManageTrades /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
