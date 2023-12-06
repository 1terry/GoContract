import React, { useState } from 'react';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // To display messages to the user

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Clear previous messages

    // Simple validation
    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    try {
      console.log('Sending:', { username: email, password: password });

      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }),
      });

      const data = await response.json();
      console.log (data);
      if (response.status === 201) {
        console.log('Sign Up Successful', data);
        setMessage('Sign Up Successful!'); // Display success message
        // Redirect or handle success scenario
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
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
