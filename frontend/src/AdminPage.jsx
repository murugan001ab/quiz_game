import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [activeForm, setActiveForm] = useState(null);
  const navigate = useNavigate();
  const developers = [
    { name: "John Doe", role: "Frontend Developer" },
    { name: "Jane Smith", role: "Backend Developer" },
    { name: "Alex Johnson", role: "UI/UX Designer" }
  ];

  return (
    <div className="quiz-admin-page">
      {/* Header with Logo */}
      <header className="quiz-admin-header">
        <div className="quiz-logo-container">
          <div className="quiz-logo">Q</div>
          <h1 className="quiz-logo-text">QuizMaster</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="quiz-admin-main">
        <div className="quiz-admin-container">
          <div className="quiz-admin-card">
            <h2 className="quiz-admin-title">QUIZ GAME</h2>
            {/* <p className="quiz-admin-subtitle">Manage your quiz platform with ease</p> */}
            <br />
            <br />
            <div className="quiz-admin-buttons">
              <button 
                className="quiz-admin-btn login-btn"
                onClick={() => navigate('/admin')}
              >
                Admin Login
              </button>
              <button 
                className="quiz-admin-btn signup-btn"
                onClick={() => navigate("/admin/create")}
              >
                Admin Sign Up
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Admin Forms (conditionally rendered) - Logic remains same */}
      {activeForm && (
        <div className="quiz-admin-modal">
          <div className="quiz-modal-content">
            <button className="quiz-modal-close" onClick={() => setActiveForm(null)}>×</button>
            <h2>{activeForm === 'login' ? 'Admin Login' : 'Admin Sign Up'}</h2>
            
            <form className="quiz-admin-form">
              <div className="quiz-form-group">
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Enter your email" 
                />
              </div>
              
              <div className="quiz-form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  placeholder="Enter your password" 
                />
              </div>
              
              {activeForm === 'signup' && (
                <div className="quiz-form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirm-password" 
                    placeholder="Confirm your password" 
                  />
                </div>
              )}
              
              <button type="submit" className="quiz-form-submit">
                {activeForm === 'login' ? 'Login' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="quiz-admin-footer">
        <div className="quiz-footer-content">
          <div className="quiz-footer-team">
            <h3>Development Team</h3>
            <ul>
              {developers.map((dev, index) => (
                <li key={index}>
                  <strong>{dev.name}</strong> - {dev.role}
                </li>
              ))}
            </ul>
          </div>
          <div className="quiz-footer-copyright">
            © {new Date().getFullYear()} QuizMaster Pro. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Styles */}
      <style jsx>{`
        .quiz-admin-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Poppins', sans-serif;
          background-color: #f8f9fa;
        }

        /* Header Styles */
        .quiz-admin-header {
          background: linear-gradient(135deg, #6e45e2 0%, #88d3ce 100%);
          padding: 1.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .quiz-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .quiz-logo {
          width: 50px;
          height: 50px;
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          color: #6e45e2;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .quiz-logo-text {
          color: white;
          font-size: 2rem;
          margin: 0;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        }

        /* Main Content Styles */
        .quiz-admin-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .quiz-admin-container {
          width: 100%;
          max-width: 500px;
        }

        .quiz-admin-card {
          background: white;
          border-radius: 12px;
          padding: 2.5rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .quiz-admin-title {
          color: #343a40;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .quiz-admin-subtitle {
          color: #6c757d;
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .quiz-admin-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quiz-admin-btn {
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-btn {
          background-color: #6e45e2;
          color: white;
        }

        .login-btn:hover {
          background-color: #5d3acf;
          transform: translateY(-2px);
        }

        .signup-btn {
          background-color: white;
          color: #6e45e2;
          border: 2px solid #6e45e2;
        }

        .signup-btn:hover {
          background-color: #f0f0f0;
          transform: translateY(-2px);
        }

        /* Modal Styles */
        .quiz-admin-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .quiz-modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          width: 90%;
          max-width: 400px;
          position: relative;
        }

        .quiz-modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6c757d;
        }

        .quiz-admin-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .quiz-form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quiz-form-group label {
          font-weight: 500;
          color: #495057;
        }

        .quiz-form-group input {
          padding: 0.8rem;
          border: 1px solid #ced4da;
          border-radius: 8px;
          font-size: 1rem;
        }

        .quiz-form-group input:focus {
          outline: none;
          border-color: #6e45e2;
          box-shadow: 0 0 0 3px rgba(110, 69, 226, 0.2);
        }

        .quiz-form-submit {
          background-color: #6e45e2;
          color: white;
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
          transition: background-color 0.3s;
        }

        .quiz-form-submit:hover {
          background-color: #5d3acf;
        }

        /* Footer Styles */
        .quiz-admin-footer {
          background-color: #343a40;
          color: white;
          padding: 2rem 1.5rem;
        }

        .quiz-footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .quiz-footer-team h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }

        .quiz-footer-team ul {
          list-style: none;
          padding: 0;
          margin-bottom: 1.5rem;
        }

        .quiz-footer-team li {
          margin-bottom: 0.5rem;
          color: #adb5bd;
        }

        .quiz-footer-team strong {
          color: white;
        }

        .quiz-footer-copyright {
          color: #adb5bd;
          font-size: 0.9rem;
          text-align: center;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .quiz-admin-card {
            padding: 1.5rem;
          }

          .quiz-admin-title {
            font-size: 1.8rem;
          }
        }

        @media (max-width: 480px) {
          .quiz-logo-container {
            flex-direction: column;
            gap: 0.5rem;
          }

          .quiz-logo-text {
            font-size: 1.8rem;
          }

          .quiz-admin-main {
            padding: 1.5rem;
          }

          .quiz-admin-title {
            font-size: 1.5rem;
          }

          .quiz-admin-subtitle {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminPage;