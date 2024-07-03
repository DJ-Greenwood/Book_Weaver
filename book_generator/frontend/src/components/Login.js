import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css'; // Assuming the CSS file is named Login.css

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      if (response.data.message === 'Login successful!') {
        localStorage.setItem('userId', response.data.user_id);
        setIsLoggedIn(true);
        alert(response.data.message);
        navigate('/dashboard');
      }
    } catch (error) {
      alert("Please register first, or check your username and password.");
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-2 mb-2">Login</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="mb-1">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="dashboard-input"
            />
          </div>
          <div className="mb-1">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="dashboard-input"
            />
          </div>
          <div className="button-group">
            <button type="submit" className="dashboard-button">Login</button>
            <button type="button" className="dashboard-button" onClick={() => navigate('/register')}>Register</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
