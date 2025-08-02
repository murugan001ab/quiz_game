// ...imports
import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from './AdminProvider';
import QRCodeGenerator from './ScanQr';

const QuizStartPage = () => {
  const socket = useRef(null);
  const socketName = useRef(null);
  const navigate = useNavigate();
  const { BASE_URL } = useContext(AdminContext);

  const [adminId, setAdminId] = useState(localStorage.getItem('adminId') || null);
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // WebSocket for quiz control
  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    setAdminId(adminId);

    socket.current = new WebSocket(`ws://${BASE_URL}/ws/chat/`);

    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnectionStatus('connected');
    };

    socket.current.onclose = () => setConnectionStatus('disconnected');
    socket.current.onerror = () => setConnectionStatus('error');

    return () => socket.current?.close();
  }, []);

  // WebSocket for user name list
  useEffect(() => {
    socketName.current = new WebSocket(`ws://${BASE_URL}/ws/name/`);

    socketName.current.onopen = () => {
      console.log("✅ [NAME] WebSocket connected");
    };

    socketName.current.onmessage = (event) => {
  console.log("[NAME] Message received:", event.data);
  try {
    const data = JSON.parse(event.data);
    console.log("[NAME] Received:", data);


    if (data.type === "user_list" && Array.isArray(data.user_list)) {
  setUserList((prevList) => {
    const existingUsers = new Set(prevList);
    const newUsers = data.user_list.filter((u) => !existingUsers.has(u));
    return [...prevList, ...newUsers];
  });

}

  } catch (error) {
    console.error("[NAME] Error parsing message:", error);
  }
};

   
    return () => socketName.current?.close();
  }, [userList]);

  const startQuiz = () => {
    if (connectionStatus !== 'connected') return alert("WebSocket not connected.");
    setIsLoading(true);

    socket.current.send(JSON.stringify({
      type: 'quiz-control',
      show: true,
      action: 'start',
      adminid: adminId,
      timestamp: new Date().toISOString()
    }));

    navigate('/admin/new-quiz');
  };

  return (
    <div className="quiz-start-container">
      <div className="quiz-start-card">
        <div className="quiz-header">
          <h1>Quiz Game</h1>
        </div>

        <div className="content-area">
          {/* Left: User List */}
          <div className="user-list">
            <h2>👥 Joined Users ({userList.length})</h2>
            <ul>
              {userList.map((user, idx) => (
                <li key={idx}>{user}</li>
              ))}
            </ul>
          </div>

          {/* Right: QR Code */}
          <div className="qr-section">
            <h2>Scan to Join</h2>
            <div className="qr-wrapper">
              <QRCodeGenerator />
            </div>
            <p className="qr-instruction">Participants can scan this QR to join</p>
          </div>
        </div>

        <button
          className={`start-quiz-btn ${isLoading ? 'loading' : ''}`}
          onClick={startQuiz}
          disabled={isLoading || connectionStatus !== 'connected'}
        >
          {isLoading ? <><span className="spinner"></span> Starting Quiz...</> : 'Start Quiz Now'}
        </button>

        {connectionStatus !== 'connected' && (
          <p className="help-text">⚠️ Connection issue. Check network or refresh.</p>
        )}
      </div>

      {/* STYLE */}
      <style jsx>{`
        .quiz-start-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ecf0f1;
          padding: 20px;
        }

        .quiz-start-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 30px;
          width: 100%;
          max-width: 1000px;
          text-align: center;
        }

        .quiz-header h1 {
          font-size: 32px;
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .content-area {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 30px;
        }

        .user-list, .qr-section {
          flex: 1 1 45%;
          background: #f7f9fb;
          padding: 20px;
          border-radius: 12px;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
        }

        .user-list h2, .qr-section h2 {
          font-size: 20px;
          color: #34495e;
        }

        .user-list ul {
          list-style: none;
          padding: 0;
          text-align: left;
          margin-top: 15px;
          max-height: 300px;
          overflow-y: auto;
        }

        .user-list ul li {
          padding: 8px 10px;
          background: white;
          border: 1px solid #ddd;
          margin-bottom: 8px;
          border-radius: 6px;
          font-size: 15px;
        }

        .qr-wrapper {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          display: inline-block;
        }

        .qr-instruction {
          margin-top: 10px;
          font-size: 13px;
          color: #7f8c8d;
        }

        .start-quiz-btn {
          margin-top: 30px;
          background: #3498db;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .start-quiz-btn:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .start-quiz-btn:hover:not(:disabled) {
          background: #2980b9;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .help-text {
          margin-top: 20px;
          font-size: 14px;
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .content-area {
            flex-direction: column;
          }

          .user-list, .qr-section {
            flex: 1 1 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default QuizStartPage;
