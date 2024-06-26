import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './Styles/App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function NavigateButton({ path, label }) {
  return (
    <Link to={path} className="navigate-button">{label}</Link>
  );
}

function App() {
  return (
    <Router>

        <div>
          <NavigateButton path="/login" label= "Login" />
          <NavigateButton path="/register" label="Registration" />
          <NavigateButton path="/dashboard" label="Dashboard" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
    </Router>
  );
}

export default App;
