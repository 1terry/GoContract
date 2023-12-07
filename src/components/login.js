import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // To display messages to the user

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Clear previous messages

    // Simple validation
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      console.log("Sending:", { username: email, password: password });

      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: email, password: password })
      });

      const data = await response.json();
      console.log(data);
      if (response.status === 201) {
        console.log("Login Successful", data);
        setMessage("Login Successful!"); // Display success message
        // Redirect or handle success scenario
      } else {
        console.error("Login Failed email:", email, password);
        setMessage(data.message || "Login Failed"); // Display error message from server or default message
      }
    } catch (error) {
      console.error("Error during Login", error);
      setMessage("An error occurred during Login"); // Display error message
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
