import React, { useState } from 'react';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Here you would usually send the data to the server
    console.log('Sign Up with:', email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;
