import React from "react";
import { Link } from "react-router-dom";
import './navigation.css';

function Navigation() {
  return (
    <div className='format'>
      <Link to="/login"><button className='btn btn-primary'>Log In</button></Link>
      <Link to="/signup"><button className='btn btn-primary'>Sign Up</button></Link>

    </div>
  );
}

export default Navigation;
