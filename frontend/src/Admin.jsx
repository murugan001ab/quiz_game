

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiUserPlus, FiLock, FiHelpCircle } from 'react-icons/fi';

const AdminLogin = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setAdminId } = useContext(AdminContext);
  const navigate = useNavigate();
    const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post('http://localhost:8000/api/admin/login/', {
        name,
        password,
      });
      
      if (res.data.message == "Login successful") {
        setMessage('Login successful!');
        navigate("/admin/dashboard");
        setAdminId(res.data.admin_id);
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      setMessage('Login failed!');
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <FiLock size={28} />
            <span>Admin Portal</span>
          </div>
          {/* <h2>Welcome Back</h2>
          <p>Please enter your credentials to access the dashboard</p> */}
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label htmlFor="name">Admin Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your admin name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options-row">
            <Link to="/forget" className="forgot-password">
               Forgot password <FiHelpCircle size={14} />
            </Link>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : (
              <>
                <FiLogIn size={18} /> Login
              </>
            )}
          </button>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="signup-link">
            Don't have an account?{' '}
            <Link to="/admin/create">
              Create new account <FiUserPlus size={14} /> 
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
  }

  .login-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 420px;
    padding: 40px;
    transition: all 0.3s ease;
  }

  .login-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #4a6bff;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .login-header h2 {
    color: #2d3748;
    margin-bottom: 8px;
    font-size: 24px;
  }

  .login-header p {
    color: #718096;
    font-size: 14px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .input-group label {
    font-size: 14px;
    color: #4a5568;
    font-weight: 500;
  }

  .input-group input {
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .input-group input:focus {
    border-color: #4a6bff;
    box-shadow: 0 0 0 3px rgba(74, 107, 255, 0.1);
    outline: none;
  }

  .options-row {
    display: flex;
    justify-content: flex-end;
  }

  .forgot-password {
    color: #4a6bff;
    font-size: 13px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color 0.2s ease;
  }

  .forgot-password:hover {
    color: #3a56db;
    text-decoration: underline;
  }

  .login-button {
    background: #4a6bff;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.2s ease;
  }

  .login-button:hover {
    background: #3a56db;
  }

  .login-button:disabled {
    background: #c3cfe2;
    cursor: not-allowed;
  }

  .message {
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    text-align: center;
  }

  .message.success {
    background: #f0fff4;
    color: #2f855a;
    border: 1px solid #c6f6d5;
  }

  .message.error {
    background: #fff5f5;
    color: #c53030;
    border: 1px solid #fed7d7;
  }

  .signup-link {
    text-align: center;
    font-size: 14px;
    color: #718096;
    margin-top: 10px;
  }

  .signup-link a {
    color: #4a6bff;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: color 0.2s ease;
  }

  .signup-link a:hover {
    color: #3a56db;
    text-decoration: underline;
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default AdminLogin;