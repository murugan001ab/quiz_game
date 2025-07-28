import React from 'react';
import { FiBook, FiSettings, FiBarChart2, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './Logout';
import './AdminDashboard.css'; // Create this CSS file

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <FiSettings className="logo-icon" />
          <h2>QuizMaster Admin</h2>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-item active">
            <FiBarChart2 className="menu-icon" />
            <span>Dashboard</span>
          </div>
        </div>
        
        <LogoutButton className="logout-btn">
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </LogoutButton>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="user-info">
            <div className="user-avatar">AD</div>
            <span>Admin User</span>
          </div>
        </header>

        <div className="management-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button 
              className="action-btn question-btn"
              onClick={() => navigate('/admin/questions')}
            >
              <FiBook className="btn-icon" />
              <span>Manage Questions</span>
              <p>Add, edit or remove quiz questions</p>
            </button>
            
            <button 
              className="action-btn game-btn"
              onClick={() => navigate('/admin/start-quiz')}
            >
              <FiSettings className="btn-icon" />
              <span>Manage Games</span>
              <p>Configure game settings and rules</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;