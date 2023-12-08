import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/login";
import SignUp from "./components/signup";
import ContractorDashboard from "./components/contractorDashboard";
import ConditionalNavigation from "./components/conditionalNavigation";
import PrivateRoute from "./components/PrivateRoute";
import ManageBookings from "./components/ManageBookings";
import ManageTrades from "./components/ManageTrades";
import GetInvoice from "./components/loadinvoice";
import Invoice from "./components/invoice";
import ContractorProfile from "./components/contractorProfile";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap your routes with AuthProvider */}
      <Router>
        <ConditionalNavigation />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/getInvoice"
            element={<GetInvoice data={12}></GetInvoice>}
          ></Route>
          <Route
            path="/contractorDashboard"
            element={
              <PrivateRoute>
                <ContractorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/invoice"
            element={
              <PrivateRoute>
                <Invoice data={Data} />
              </PrivateRoute>
            }
          />
          <Route
            path="/contractorDashboard"
            element={
              <PrivateRoute>
                <ContractorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/manageBookings"
            element={
              <PrivateRoute>
                <ManageBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/manageTrades"
            element={
              <PrivateRoute>
                <ManageTrades />
              </PrivateRoute>
            }
          />
          <Route
            path="/contractorProfile"
            element={
              <PrivateRoute>
                <ContractorProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
