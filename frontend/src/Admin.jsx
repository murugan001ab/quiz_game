import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';
import { Link, useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setAdminId, setIsLogin,BASE_URL } = useContext(AdminContext);
  const navigate = useNavigate();

  // Check for existing session on component mount
  useEffect(() => {
    const storedAdminId = localStorage.getItem('adminId');
    const storedExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (storedAdminId && storedExpiry && new Date().getTime() < parseInt(storedExpiry)) {
      setAdminId(storedAdminId);
      setIsLogin(true);
      navigate('/admin/dashboard');
    }
  }, [setAdminId, setIsLogin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`https://${BASE_URL}/api/admin/login/`, {
        name,
        password,
      });
      
      if (res.data.message === "Login successful") {
        setMessage('Login successful!');
        
        // Set session in localStorage (24 hours expiry)
        const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
        localStorage.setItem('adminId', res.data.admin_id);
        localStorage.setItem('adminSessionExpiry', expiryTime.toString());
        
        setAdminId(res.data.admin_id);
        setIsLogin(true);
        navigate('/admin/dashboard');
      } else {
        setMessage('Invalid credentials');
      }
    } catch (error) {
      console.error(error);
      setMessage('Login failed!');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>Admin Login</h2>
        </div>
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Admin Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button">Login</button>
          
          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>
        
        <div className="admin-login-links">
          <Link to="/admin/create" className="link">Create new account</Link>
          <Link to="/forget" className="link">Forgot password?</Link>
        </div>
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        
        .admin-login-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        
        .admin-login-header {
          margin-bottom: 30px;
          position: relative;
        }
        
        .admin-login-header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 24px;
        }
        
        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          text-align: left;
        }
        
        .form-group input {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #dfe6e9;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s;
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }
        
        .login-button {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
        }
        
        .login-button:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }
        
        .message {
          padding: 10px;
          border-radius: 5px;
          margin-top: 15px;
          font-size: 14px;
        }
        
        .message.success {
          background: #d4edda;
          color: #155724;
        }
        
        .message.error {
          background: #f8d7da;
          color: #721c24;
        }
        
        .admin-login-links {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .link {
          color: #3498db;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s;
        }
        
        .link:hover {
          color: #2980b9;
          text-decoration: underline;
        }
        
        /* Responsive styles */
        @media (max-width: 480px) {
          .admin-login-card {
            padding: 30px 20px;
          }
          
          .admin-login-header h2 {
            font-size: 20px;
          }
          
          .form-group input {
            padding: 10px 12px;
          }
          
          .login-button {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
