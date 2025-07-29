import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizPage from './userquiz';
import { AdminContext } from './AdminProvider';

const GetReady = () => {
  const socket = useRef(null);
  const navigate = useNavigate();
  const [isShowing, setIsShowing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [countdown, setCountdown] = useState(null);

  
  // Get all needed values from context
  const { aname, adminId, setAdminId,BASE_URL } = useContext(AdminContext);

  useEffect(() => {
    socket.current = new WebSocket(`ws://${BASE_URL}/ws/chat/`);

    socket.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnectionStatus('connected');
    };

    socket.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        // Always update admin ID if it's in the message
        if (data.adminid) {
          setAdminId(data.adminid);
          localStorage.setItem('adminId',data.adminid);
          localStorage.setItem('startgame',true);
          console.log("Admin ID updated in context");
        }

        if (data.show === true && data.action === 'start') {
          console.log("Quiz is starting...");
          // Start a countdown before showing the quiz
          setCountdown(5);
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
  }, []); // Empty dependency array to run only once

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setIsShowing(true);
    }
  }, [countdown]);

  // Add useEffect to log adminId changes
  useEffect(() => {
    console.log("Current adminId:", adminId);
  }, [adminId]);

  return (
    <div style={styles.container}>
      {isShowing ? (
        <QuizPage name={aname} />
      ) : (
        <div style={styles.content}>
          <div style={styles.card}>
            <div style={styles.header}>
              <div style={styles.logo}>QuizMaster</div>
              <h1 style={styles.title}>Get Ready, {aname}!</h1>
            </div>
            
            <div style={styles.messageContainer}>
              <p style={styles.message}>The quiz will start soon...</p>
              
              {countdown ? (
                <div style={styles.countdown}>{countdown}</div>
              ) : (
                <div style={styles.loader}></div>
              )}
              
              {/* <p style={styles.hint}>Please wait while the host prepares the quiz</p> */}
            </div>
            
            {/* <div style={styles.statusContainer}>
              <div style={styles.statusItem}>
                <div style={styles.statusLabel}>Connection:</div>
                <div style={styles.statusValue(connectionStatus)}>
                  {connectionStatus}
                </div>
              </div>
              
              <div style={styles.statusItem}>
                <div style={styles.statusLabel}>Host ID:</div>
                <div style={styles.statusValue('id')}>
                  {adminId || 'Connecting...'}
                </div>
              </div>
            </div> */}
            
            {/* <div style={styles.animationContainer}>
              <div style={styles.person}>
                <div style={styles.head}></div>
                <div style={styles.body}></div>
                <div style={styles.handLeft}></div>
                <div style={styles.handRight}></div>
              </div>
              <div style={styles.thoughtBubble}>
                <div style={styles.thoughtDot}></div>
                <div style={styles.thoughtDot}></div>
                <div style={styles.thoughtDot}></div>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f5ff',
    backgroundImage: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  content: {
    width: '100%',
    maxWidth: '600px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    marginBottom: '30px',
  },
  logo: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#4361ee',
    marginBottom: '10px',
    background: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
  },
  title: {
    fontSize: '2rem',
    color: '#1e293b',
    margin: '0',
    fontWeight: '600',
  },
  messageContainer: {
    marginBottom: '40px',
  },
  message: {
    fontSize: '1.4rem',
    color: '#64748b',
    margin: '0 0 20px',
  },
  countdown: {
    fontSize: '5rem',
    fontWeight: '700',
    color: '#3a0ca3',
    margin: '20px 0',
    lineHeight: 1,
    animation: 'pulse 1.5s infinite',
  },
  hint: {
    fontSize: '1.1rem',
    color: '#94a3b8',
    margin: '20px 0 0',
    fontStyle: 'italic',
  },
  loader: {
    width: '80px',
    height: '80px',
    border: '8px solid #f0f5ff',
    borderTop: '8px solid #4361ee',
    borderRadius: '50%',
    margin: '30px auto',
    animation: 'spin 1.5s linear infinite',
  },
  statusContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: '1rem',
    color: '#64748b',
    marginBottom: '8px',
  },
  statusValue: (status) => ({
    fontSize: '1.2rem',
    fontWeight: '600',
    color: status === 'connected' ? '#4ade80' : 
           status === 'disconnected' ? '#f87171' : 
           status === 'error' ? '#f87171' : 
           status === 'id' ? '#3b82f6' : '#1e293b',
    backgroundColor: status === 'connected' ? '#dcfce7' : 
                    status === 'disconnected' ? '#fee2e2' : 
                    status === 'error' ? '#fee2e2' : 
                    status === 'id' ? '#dbeafe' : '#f1f5f9',
    padding: '8px 20px',
    borderRadius: '30px',
    minWidth: '150px',
  }),
  animationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30px',
    height: '150px',
    position: 'relative',
  },
  person: {
    position: 'relative',
    width: '80px',
    height: '120px',
  },
  head: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '50px',
    height: '50px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
  },
  body: {
    position: 'absolute',
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '70px',
    backgroundColor: '#3b82f6',
    borderRadius: '20px',
  },
  handLeft: {
    position: 'absolute',
    top: '60px',
    left: '5px',
    width: '20px',
    height: '40px',
    backgroundColor: '#3b82f6',
    borderRadius: '10px',
    transform: 'rotate(30deg)',
    animation: 'waveLeft 2s infinite',
  },
  handRight: {
    position: 'absolute',
    top: '60px',
    right: '5px',
    width: '20px',
    height: '40px',
    backgroundColor: '#3b82f6',
    borderRadius: '10px',
    transform: 'rotate(-30deg)',
    animation: 'waveRight 2s infinite',
  },
  thoughtBubble: {
    position: 'absolute',
    top: '10px',
    right: '50px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  thoughtDot: {
    width: '10px',
    height: '10px',
    backgroundColor: '#dbeafe',
    borderRadius: '50%',
    animation: 'floatUp 3s infinite',
  },
  
  // Animations
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 1 },
    '50%': { transform: 'scale(1.1)', opacity: 0.7 },
    '100%': { transform: 'scale(1)', opacity: 1 },
  },
  '@keyframes waveLeft': {
    '0%': { transform: 'rotate(30deg)' },
    '50%': { transform: 'rotate(10deg)' },
    '100%': { transform: 'rotate(30deg)' },
  },
  '@keyframes waveRight': {
    '0%': { transform: 'rotate(-30deg)' },
    '50%': { transform: 'rotate(-10deg)' },
    '100%': { transform: 'rotate(-30deg)' },
  },
  '@keyframes floatUp': {
    '0%': { transform: 'translateY(0)', opacity: 0 },
    '30%': { transform: 'translateY(-10px)', opacity: 1 },
    '70%': { transform: 'translateY(-20px)', opacity: 0.5 },
    '100%': { transform: 'translateY(-30px)', opacity: 0 },
  },
  
  // Responsive styles
  '@media (max-width: 768px)': {
    card: {
      padding: '30px 20px',
    },
    title: {
      fontSize: '1.7rem',
    },
    message: {
      fontSize: '1.2rem',
    },
    countdown: {
      fontSize: '4rem',
    },
    statusContainer: {
      flexDirection: 'column',
      gap: '15px',
    },
    statusValue: {
      minWidth: '120px',
    },
  },
  '@media (max-width: 480px)': {
    title: {
      fontSize: '1.5rem',
    },
    message: {
      fontSize: '1.1rem',
    },
    countdown: {
      fontSize: '3.5rem',
    },
  },
};

export default GetReady;
