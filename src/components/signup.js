import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [message, setMessage] = useState(''); // To display messages to the user

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Clear previous messages

    // Simple validation
    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }
    if (userType ==="") {
      setMessage('please select a user type');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password, userType: userType}),
      });

      const data = await response.json();
      if (response.status === 201) {
        setMessage('Sign Up Successful!'); // Display success message
        navigate('/login');

      } else {
        console.error('Sign Up Failed emnail:', email,password);
        setMessage(data.message || 'Sign Up Failed'); // Display error message from server or default message
      }
    } catch (error) {
      console.error('Error during sign up', error);
      setMessage('An error occurred during sign up'); // Display error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
      <label>
        User Type
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="" disabled selected>Select User Type</option>
          <option value="contractor">Contractor</option>
          <option value="homeowner">Home Owner</option>
        </select>
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
