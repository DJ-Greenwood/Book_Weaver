import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import '../Styles/Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate ();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/register', { username, password });
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className='register-container'>
      <div className='register-h2'>
        <h2>Register</h2>
          <div className='register-form'>
            <form onSubmit={handleSubmit}>
              <div className='register-label'>
                <label>Username: </label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}  className='register-input'/>
              </div>
              <div className='register-label'>
                <label>Password:  </label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='register-passwordinput'/>
              </div>

              <button className='register-button' type="submit" >Register</button>
           </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
