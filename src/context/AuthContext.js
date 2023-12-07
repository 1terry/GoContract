import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({}); // Initial state is an empty object

  const login = (data) => {
    setIsAuthenticated(true);
    setUserData(data); // Set user data on login
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserData({}); // Reset user data on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userData, setUserData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
