import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/login', {
        username,
        password,
      });

      if (response.status === 200) {
        login(username); // <-- hier geven we de username door aan context
        navigate('/');
      } else {
        setError('Login mislukt. Probeer opnieuw.');
      }
    } catch (error) {
      setError('Er is een fout opgetreden. Probeer opnieuw.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card border-primary mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-header text-white bg-primary">
          <h4 className="mb-0 text-center">Login</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleLogin}>
            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
