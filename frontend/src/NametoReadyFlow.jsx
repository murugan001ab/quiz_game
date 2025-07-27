import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizPage from './userquiz';
import { AdminContext } from './AdminProvider';

const GetReady = ({ name }) => {
  const socket = useRef(null);
  const navigate = useNavigate();
  const [ isShowing, setIsShowing ] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000/ws/chat/");

    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnectionStatus('connected');
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        console.log("Received message:", data);

        if (data.show==true && data.action == 'start') {
          console.log("Quiz is starting...");
          setIsShowing(true);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus('error');
    };

    socket.current.onclose = () => {
      console.log("WebSocket closed");
      setConnectionStatus('disconnected');
    };

    return () => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        socket.current.close();
      }
    };
  }, [isShowing]);

  return (
    <>
      {isShowing ? (
        <QuizPage name={name} />
      ) : (
        <div style={styles.container}>
          <h2 style={styles.title}>Get Ready, {name}!</h2>
          <p style={styles.message}>The quiz will start soon...</p>
          <p>Connection status: {connectionStatus}</p>
          <div style={styles.loader}></div>
        </div>
      )}
    </>
  );
};

// ... (rest of your NameToReadyFlow component remains the same)
const styles = {
  appContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  container: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '300px',
  },
  title: {
    color: '#333',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
  message: {
    color: '#666',
    marginBottom: '1.5rem',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #4CAF50',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
};

// Export the main component that manages the flow
export default GetReady;