import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from './AdminProvider';
import QRCodeGenerator from './ScanQr';

const QuizStartPage = () => {
  const socket = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const { adminId } = useContext(AdminContext);

  useEffect(() => {
    // Connect to WebSocket
    socket.current = new WebSocket("ws://quizmastershub.duckdns.org/ws/chat/");

    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnectionStatus('connected');
    };

    socket.current.onclose = () => {
      console.log("WebSocket closed");
      setConnectionStatus('disconnected');
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus('error');
    };

    return () => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, []);

  const startQuiz = () => {
    if (connectionStatus !== 'connected') {
      alert('WebSocket not connected. Please try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      socket.current.send(JSON.stringify({ 
        type: 'quiz-control', 
        show: true,
        action: 'start',
        adminid: adminId,
        timestamp: new Date().toISOString()
      }));
      console.log("Quiz start message sent");
      navigate('/admin/new-quiz');
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return '#2ecc71';
      case 'disconnected': return '#e74c3c';
      case 'error': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  return (
    <div className="quiz-start-container">
      <div className="quiz-start-card">
        <div className="quiz-header">
          <h1>Quiz Game</h1>
          <div className="connection-status">
            {/* <span className="status-indicator" style={{ backgroundColor: getStatusColor() }}></span>
            <span className="status-text">Status: {connectionStatus}</span> */}
          </div>
          
        </div>

        <div className="qr-code-section">
          <h2>Scan to Join</h2>
          <div className="qr-code-wrapper">
            <QRCodeGenerator />
          </div>
          <p className="qr-instruction">Participants can scan this QR code to join the quiz</p>
        </div>

        <button 
          className={`start-quiz-btn ${isLoading ? 'loading' : ''}`} 
          onClick={startQuiz} 
          disabled={isLoading || connectionStatus !== 'connected'}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Starting Quiz...
            </>
          ) : (
            'Start Quiz Now'
          )}
        </button>

        <div className="connection-help">
          {connectionStatus !== 'connected' && (
            <p className="help-text">
              <i>⚠️ Connection issues detected. Please check your network and refresh the page.</i>
            </p>
          )}
        </div>
      </div>

      <style jsx>{`
        .quiz-start-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }

        .quiz-start-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 500px;
          text-align: center;
        }

        .quiz-header {
          margin-bottom: 30px;
        }

        .quiz-header h1 {
          color: #2c3e50;
          margin: 0 0 10px 0;
          font-size: 28px;
        }

        .connection-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #7f8c8d;
          font-size: 14px;
        }

        .status-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .status-text {
          text-transform: capitalize;
        }

        .qr-code-section {
          margin: 30px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .qr-code-section h2 {
          color: #2c3e50;
          margin-top: 0;
          font-size: 22px;
        }

        .qr-code-wrapper {
          margin: 20px auto;
          padding: 15px;
          background: white;
          border-radius: 8px;
          display: inline-block;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .qr-instruction {
          color: #7f8c8d;
          font-size: 14px;
          margin-bottom: 0;
        }

        .start-quiz-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .start-quiz-btn:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(41, 128, 185, 0.3);
        }

        .start-quiz-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
          opacity: 0.8;
        }

        .start-quiz-btn.loading {
          background: #3498db;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .connection-help {
          margin-top: 20px;
        }

        .help-text {
          color: #e74c3c;
          font-size: 14px;
          margin: 0;
        }

        /* Responsive styles */
        @media (max-width: 600px) {
          .quiz-start-card {
            padding: 30px 20px;
          }

          .quiz-header h1 {
            font-size: 24px;
          }

          .qr-code-section {
            padding: 15px;
          }

          .qr-code-section h2 {
            font-size: 20px;
          }

          .start-quiz-btn {
            padding: 12px 20px;
            font-size: 15px;
          }
        }

        @media (max-width: 400px) {
          .quiz-start-container {
            padding: 15px;
          }

          .quiz-header h1 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizStartPage;