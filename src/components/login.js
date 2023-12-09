import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './login.css';
import { Navigation } from "./Navigation";

function Login() {
  const { login, setUserData } = useAuth(); // Destructure setUserData from the context
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // To display messages to the user

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Clear previous messages
    console.log("Test");
    // Simple validation
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: email, password: password })
      });

      const data = await response.json();
      console.log(data.userType);
      if (response.status === 200) {
        if (data.userType === "contractor") {
          fetch(`http://localhost:3001/getUserInfo?username=${email}`, {
            headers: {
              Accept: "application/json"
            }
          })
            .then((response) => {
              if (!response.ok) {
                console.log("error");
                throw new Error("Network response was not ok");
              }
              return response.json(); // Convert the response to JSON
            })
            .then((data) => {
              console.log("Setting user data", data);
              login(data);
              navigate("/contractorDashboard");
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
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
        console.error("Login Failed email:", email, password);
        setMessage(data.message || "Login Failed"); // Display error message from server or default message
      }
    } catch (error) {
      console.error("Error during Login", error);
      setMessage("An error occurred during Login"); // Display error message
    }
  };

  return (
      <div className="background">
        
    <div class="area" >
                <ul class="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
        </div >
      <div className="loginBox">
        <img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px" alt="User" />
        <h3>Sign in here</h3>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <input   
              id="uname"
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username" />
            <input 
              id="pass"  
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" />
          </div>
          <input type="submit" name="" value="Login" />
        </form>
        {/* <a href="#">Forget Password<br /></a> */}
        <div className="text-center">
          {/* <p style={{ color: '#59238F' }}>Sign-Up</p> */}
        </div>
      </div>
      </div>
    );
    
    
    
    
    
    
    <div className='container'>
    <form className='format2' onSubmit={handleSubmit}>
      <h2>Login</h2>
      {message && <div>{message}</div>} {/* Display messages to the user */}
      <div>
      <label className='inputField'>
        {/* Email: */}
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </label>
      </div>
      <div>
      <label className='inputField'>
        {/* Password: */}
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </label>
      </div>
      <button type="submit">Login</button>
    </form>
    </div>
  // );
}

export default Login;
