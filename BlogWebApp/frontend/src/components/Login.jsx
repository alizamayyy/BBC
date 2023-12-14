import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:5000/users', userData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      alert('User created successfully!');
      setIsLogin(true);
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register user.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginData = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post('http://localhost:5000/login', loginData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        // Store the entire user object in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));

        // Redirect to Home.jsx after successful login
        navigate('/home');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="Login min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <header className="mb-4">
        <h1 className="text-4xl font-bold text-gray-700">Welcome to My Web App</h1>
      </header>
      <div className="form-container bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        {isLogin ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <form onSubmit={handleLogin}>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-4 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Login</button>
            </form>
            <button className="mt-4 text-blue-500 hover:text-blue-700 text-sm font-semibold" onClick={toggleForm}>Need an account? Register here</button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleRegister}>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-4 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Register</button>
            </form>
            <button className="mt-4 text-blue-500 hover:text-blue-700 text-sm font-semibold" onClick={toggleForm}>Already have an account? Login here</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
