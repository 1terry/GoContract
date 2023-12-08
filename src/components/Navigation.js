import React from "react";
import { Link } from "react-router-dom";

function Navigation() {
  return (
    <div>
      <Link to="/login">
        <button>Log In</button>
      </Link>
      <Link to="/signup">
        <button>Sign Up</button>
      </Link>
    </div>
  );
}

export default Navigation;
