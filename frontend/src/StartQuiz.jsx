import React, { useContext, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from './ScanQr';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { AdminContext } from './AdminProvider';
const QuizStartPage = () => {
  // const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const quizUrl = `http://4.247.166.182:5173/quiz`;

  const { setIsShowing } = useContext(AdminContext);

  const navigate=useNavigate();

  const startQuiz = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/admin/new-quiz');
      setIsShowing(true); // Set the context to show the quiz
    }, 1000);

    // navigate('/admin/new-quiz'); // Navigate to the quiz page
    // setShowModal(false); // Close the modal after starting the quiz
  };

  return (
    <div style={{
      ...styles.container,
      flexDirection: 'column' // Changed to column layout
    }}>
      <QRCodeGenerator />
      
      <button 
        style={styles.quizButton}
        onClick={() => startQuiz()}
      >
        StArT qUiZ
      </button>

    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    gap: '40px' // Added gap between elements
  },
  quizButton: {
    padding: '30px 80px',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#fff',
    background: 'linear-gradient(45deg, #ff6b6b, #ffa3a3)',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 10px 30px rgba(255, 107, 107, 0.4)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    animation: 'pulse 2s infinite',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
  },
  modalTitle: {
    color: '#2c3e50',
    marginBottom: '20px',
  },
  qrContainer: {
    margin: '20px 0',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
  },
  qrCaption: {
    marginTop: '15px',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px',
  },
  startButton: {
    padding: '12px 30px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    flex: 1,
  },
  closeButton: {
    padding: '12px 30px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
    flex: 1,
  },
};

// Inject styles
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  button:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(0, 0, 0, 0.2);
  }
  
  button:active:not(:disabled) {
    transform: translateY(0);
  }
  
  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
document.head.appendChild(styleTag);

export default QuizStartPage;