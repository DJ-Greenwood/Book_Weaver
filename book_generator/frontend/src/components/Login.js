import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Username length validation
   // if (username.length < 8) {
   //   alert('Username must be at least 8 characters long.');
   //   return;
   // }

    // Password mixed character set validation
    //const hasUpperCase = /[A-Z]/.test(password);
   // const hasLowerCase = /[a-z]/.test(password);
   // const hasNumbers = /\d/.test(password);
   // const hasSpecialChars = /\W/.test(password); // or /[^A-Za-z0-9]/ for including underscores as special characters

    //if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars)) {
    //  alert('Password must include uppercase letters, lowercase letters, numbers, and special characters.');
    //  return;
   // }

    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      alert(response.data.message);
      if (response.data.message === 'Login successful')
        navigate('/dashboard'); // navigate.push is not a function in react-router-dom v6, use navigate('/path') instead
   } catch (error) {
      alert("please register first, or check your username and password.");
      
    }
  };

  return (
    <div className='login-container'>
      <div classNames='login-h2'>
        <h2>Login</h2>
          <div className='login-form'>
              <form onSubmit={handleSubmit}>
                <div>
                  <div className='login-label'>
                    <label>Username: </label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='login-input'/>
                  </div>
                  <div className='login-label'>
                    <label>Password: </label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='login-passwordinput' />
                  </div>
                  <div className='button-group'>
                    <button className='login-button' type="submit">Login</button>
                    <button className='register-button' onClick={() => navigate('/register')}>Register</button>
                  </div>
                </div>
              </form>
            <div>
          </div>
        </div>
        </div>
    </div>
  );
}

export default Login;