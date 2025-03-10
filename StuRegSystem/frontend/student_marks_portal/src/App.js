import logo from './logo.svg';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Register from "./components/register";
import LogIn from './components/login';
import Marks from "./components/marks";
import Navbar from "./components/Navbar"; 


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/marks" element={<Marks />} />
      </Routes>
    </Router>
  );
}

export default App;
