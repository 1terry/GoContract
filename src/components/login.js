import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, setUserData } = useAuth(); // Destructure setUserData from the context
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // To display messages to the user

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Clear previous messages
     console.log("Test");
    // Simple validation
    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    try {

      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();
      console.log(data.userType);
      if (response.status === 200) {
        if (data.userType === "contractor") {
          fetch(`http://localhost:3001/getUserInfo?username=${email}`, {
              headers: {
                'Accept': 'application/json'
              }
            })
            .then(response => {
              if (!response.ok) {
                console.log("error");
                throw new Error('Network response was not ok');
              }
              return response.json(); // Convert the response to JSON
            })
            .then(data => {
              console.log('Setting user data', data);
              login(data);
              navigate('/contractorDashboard');
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
              // Handle any errors from fetching user data
            });
        }

        if (data.userType === "homeowner") {
          fetch(`http://localhost:3001/getUserInfo?username=${email}`, {
              headers: {
                'Accept': 'application/json'
              }
            })
            .then(response => {
              if (!response.ok) {
                console.log("error");
                throw new Error('Network response was not ok');
              }
              return response.json(); // Convert the response to JSON
            })
            .then(data => {
              console.log('Setting user data', data);
              login(data);
              navigate('/dashboard');
            })
            .catch(error => {
              console.error('Error fetching user data:', error);
              // Handle any errors from fetching user data
            });
        }
  
      } else {
        console.error('Login Failed email:', email,password);
        setMessage(data.message || 'Login Failed'); // Display error message from server or default message
      }
    } catch (error) {
      console.error('Error during Login', error);
      setMessage('An error occurred during Login'); // Display error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {message && <div>{message}</div>} {/* Display messages to the user */}
      <label>
        Email:
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </label>
      <label>
        Password:
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
