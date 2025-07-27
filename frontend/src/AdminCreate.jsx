import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminCreatePage = () => {
  const [adminData, setAdminData] = useState({ name: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://quizmastershub.duckdns.org/api/admin/create/", adminData);
      setMessage("Admin created successfully!");
      setAdminData({ name: "", password: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error creating admin.");
    }
  };

  return (
    <div className="admin-create-container">
      <div className="admin-create-card">
        <div className="admin-create-header">
          <h2>Create Admin Account</h2>
          {/* <div className="admin-logo">A+</div> */}
        </div>
        
        <form onSubmit={handleSubmit} className="admin-create-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Admin Name"
              value={adminData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={adminData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="create-button">Create Admin</button>
          
          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>
        
        <div className="admin-create-links">
          <Link to="/admin" className="link">Already have an account? Login</Link>
        </div>
      </div>

      <style jsx>{`
        .admin-create-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        
        .admin-create-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 400px;
          text-align: center;
        }
        
        .admin-create-header {
          margin-bottom: 30px;
          position: relative;
        }
        
        .admin-create-header h2 {
          color: #2c3e50;
          margin-bottom: 10px;
          font-size: 24px;
        }
        
        .admin-logo {
          width: 60px;
          height: 60px;
          margin: 0 auto 20px;
          background: #3498db;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
        }
        
        .admin-create-form {
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
        
        .create-button {
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
        
        .create-button:hover {
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
        
        .admin-create-links {
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
          .admin-create-card {
            padding: 30px 20px;
          }
          
          .admin-create-header h2 {
            font-size: 20px;
          }
          
          .admin-logo {
            width: 50px;
            height: 50px;
            font-size: 24px;
          }
          
          .form-group input {
            padding: 10px 12px;
          }
          
          .create-button {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminCreatePage;