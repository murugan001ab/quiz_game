import React, { useEffect, useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from './AdminProvider';
import QRCodeGenerator from './ScanQr';

const QuizStartPage = () => {
  const socket = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const {adminId}=useContext(AdminContext)

  useEffect(() => {
    // Connect to WebSocket
    socket.current = new WebSocket("ws://localhost:8000/ws/chat/");

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

    console.log(adminId)
    
    try {
      socket.current.send(JSON.stringify({ 
        type: 'quiz-control', 
        show: true,
        action: 'start',
        adminid:adminId,
        timestamp: new Date().toISOString()
      }));
      console.log("Quiz start message sent");
      navigate('/admin/new-quiz');
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="quiz-start-container">
      <h1>Welcome to the Quiz</h1>
      <p>Connection status: {connectionStatus}</p>
    <QRCodeGenerator/>

      <button onClick={startQuiz} disabled={isLoading || connectionStatus !== 'connected'}>
        {isLoading ? 'Starting...' : 'Start Quiz'}
      </button>
    </div>
  );
};

export default QuizStartPage;