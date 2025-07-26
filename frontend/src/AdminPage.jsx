import { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [activeForm, setActiveForm] = useState(null);
  const navigate=useNavigate();
  const developers = [
    { name: "John Doe", role: "Frontend Developer" },
    { name: "Jane Smith", role: "Backend Developer" },
    { name: "Alex Johnson", role: "UI/UX Designer" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>QuizMaster Pro</h1>
          <p className="tagline">Test your knowledge with our interactive quiz platform</p>
          
          <div className="cta-buttons">
            <button 
              className="primary-btn"
              onClick={() => navigate('/admin')}
            >
              Admin Login
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate("/admin/create")}
            >
              Admin Sign Up
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="quiz-icon">?</div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Our Quiz Platform?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Analytics</h3>
            <p>Track user performance and quiz statistics with our comprehensive dashboard.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Timed Quizzes</h3>
            <p>Challenge yourself with our timed quiz mode to test your quick thinking.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Access quizzes seamlessly across all devices with our mobile-friendly interface.</p>
          </div>
        </div>
      </section>

      {/* Admin Forms (conditionally rendered) */}
      {activeForm && (
        <div className="modal-overlay">
          <div className="admin-form">
            <button className="close-btn" onClick={() => setActiveForm(null)}>×</button>
            <h2>{activeForm === 'login' ? 'Admin Login' : 'Admin Sign Up'}</h2>
            
            <form>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" />
              </div>
              
              {activeForm === 'signup' && (
                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input type="password" id="confirm-password" placeholder="Confirm your password" />
                </div>
              )}
              
              <button type="submit" className="submit-btn">
                {activeForm === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer with Developer Credits */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>QuizMaster Pro</h3>
            <p>© {new Date().getFullYear()} All Rights Reserved</p>
          </div>
          
          <div className="developer-section">
            <h4>Development Team</h4>
            <ul className="developer-list">
              {developers.map((dev, index) => (
                <li key={index}>
                  <strong>{dev.name}</strong> - {dev.role}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AdminPage;