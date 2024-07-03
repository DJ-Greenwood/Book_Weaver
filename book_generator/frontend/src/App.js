import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './Styles/App.css';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function NavigateButton({ path, label }) {
  return (
    <Link to={path} className="navigate-button">{label}</Link>
  );
}

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('userId');
    navigate('/login');
  }, [navigate]);

  return <div>Logging out...</div>;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    window.location.href = '/login'; // Force a page refresh to update state
  };

  return (
    <Router>
      <div className="header-space"></div>
      <div className="app-container">
        <header className="app-header">
          <div className="header-content">
            <div className="title">
              <h1>Book Weaver</h1>
              <h2>Book Generator</h2>
            </div>
            <div className="text-center mt-2 mb-2">
              {isLoggedIn ? (
                <button  onClick={handleLogout}>Logout</button>
              ) : (
                <NavigateButton path="/login" label="Login" />
              )}
              <NavigateButton path="/register" label="Register" />
              <NavigateButton path="/dashboard" label="Dashboard" />
            </div>
          </div>
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
