import React, { useState } from "react";
import axios from "axios";
import { FiUserPlus, FiLock, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminCreatePage = () => {
  const [adminData, setAdminData] = useState({ name: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    

    try {
      const res = await axios.post("http://localhost:8000/api/admin/create/", adminData);
      setMessage("Admin created successfully!");
      Navigate("/admin"); // Redirect to admin login page
      setAdminData({ name: "", password: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error creating admin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <FiUserPlus size={28} />
            <span>Admin Portal</span>
          </div>
          <h2>Create New Admin</h2>
          {/* <p>Enter details to register a new admin account</p> */}
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="name">Admin Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter admin username"
              value={adminData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Create secure password"
              value={adminData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : (
              <>
                <FiArrowRight size={18} /> Create Admin
              </>
            )}
          </button>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="signup-link">
            Already have an account?{' '}
            <Link to="/admin">
              Login 
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

// CSS Styles (same as login page)
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

export default AdminCreatePage;