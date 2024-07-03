import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Register.css'; // Assuming the CSS file is named Register.css

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      if (response.data.message === 'User registered successfully!') {
        alert(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      alert("Username already exists, please try a different one.");
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-2 mb-2">Register</h2>
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
          <button type="submit" className="dashboard-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
