import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS file

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
      <li><Link to="/">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/marks">Marks Management</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
