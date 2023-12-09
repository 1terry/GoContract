import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [message, setMessage] = useState(""); // To display messages to the user

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Clear previous messages

    // Simple validation
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }
    if (userType === "") {
      setMessage("please select a user type");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          address: address,
          phoneNumber: phoneNumber,
          username: email,
          password: password,
          userType: userType
        })
      });

      const data = await response.json();
      if (response.status === 201) {
        setMessage("Sign Up Successful!"); // Display success message
        navigate("/login");
      } else {
        console.error("Sign Up Failed emnail:", email, password);
        setMessage(data.message || "Sign Up Failed"); // Display error message from server or default message
      }
    } catch (error) {
      console.error("Error during sign up", error);
      setMessage("An error occurred during sign up"); // Display error message
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
    <h3>Sign up here</h3>
    <form onSubmit={handleSubmit}>
      <div className="inputBox">
        <input   
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="first name" />
        
        <input 
          value={lastName} onChange={(e) => setLastName(e.target.value)}
          placeholder="last name" />
        
        <input 
        value={address} onChange={(e) => setAddress(e.target.value)}
        placeholder="address" />

        <input 
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="phone number" />

        <input 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email" />
        
        <input
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />

        <select className="buttonSpace" 
          value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="" disabled selected>
          Select User Type
          </option>
          <option value="contractor">Contractor</option>
          <option value="homeowner">Home Owner</option>
          </select>

       
      </div>
      <input type="submit" name="" value="Sign up" />
    </form>
    <div className="text-center">
      {/* <p style={{ color: '#59238F' }}>Sign-Up</p> */}
    </div>

  </div>
</div>
    // <form onSubmit={handleSubmit}>
    //   <h2>Sign Up</h2>
    //   {message && <div>{message}</div>} {/* Display messages to the user */}
    //   <label>
    //     First Name:
    //     <input
    //       value={firstName}
    //       onChange={(e) => setFirstName(e.target.value)}
    //     />
    //   </label>
    //   <label>
    //     Last Name:
    //     <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
    //   </label>
    //   <label>
    //     Address:
    //     <input value={address} onChange={(e) => setAddress(e.target.value)} />
    //   </label>
    //   <label>
    //     Phone Number:
    //     <input
    //       value={phoneNumber}
    //       onChange={(e) => setPhoneNumber(e.target.value)}
    //     />
    //   </label>
    //   <br></br>
    //   <label>
    //     Email:
    //     <input
    //       type="email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //   </label>
    //   <label>
    //     User Type
    //     <select value={userType} onChange={(e) => setUserType(e.target.value)}>
    //       <option value="" disabled selected>
    //         Select User Type
    //       </option>
    //       <option value="contractor">Contractor</option>
    //       <option value="homeowner">Home Owner</option>
    //     </select>
    //   </label>
    //   <br></br>
    //   <label>
    //     Password:
    //     <input
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </label>
    //   <br></br>
    //   <button type="submit">Sign Up</button>
    // </form>
  );
}

export default SignUp;
