import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GetReadyPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const startQuiz = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate('/quiz'); // Change to your quiz route
    }, 1000);
  };

  return (
    <div className="ready-container">
      <div className="ready-content">
        <h1 className="ready-text">GET Readyy</h1>
        <p className="ready-subtext">The quiz is about to begin!</p>
        {/* <button 
          className="ready-button"
          onClick={startQuiz}
          disabled={isLoading}
        >
          {isLoading ? 'Starting...' : 'Begin Now'}
        </button> */}
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .ready-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    font-family: 'Poppins', sans-serif;
  }

  .ready-content {
    text-align: center;
    max-width: 800px;
    padding: 2rem;
  }

  .ready-text {
    font-size: 5rem;
    font-weight: 800;
    color: #f4b41a;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 3px 3px 0 rgba(0,0,0,0.2);
    animation: pulse 1.5s infinite alternate;
  }

  .ready-subtext {
    font-size: 1.5rem;
    color: #fff;
    margin: 1rem 0 3rem;
    opacity: 0.9;
  }

  .ready-button {
    background: #4a6bff;
    color: white;
    border: none;
    padding: 1.2rem 3rem;
    font-size: 1.5rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    box-shadow: 0 10px 25px rgba(74, 107, 255, 0.5);
    position: relative;
    overflow: hidden;
  }

  .ready-button:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(74, 107, 255, 0.6);
    background: #3a56db;
  }

  .ready-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 10px 25px rgba(74, 107, 255, 0.3);
  }

  .ready-button::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, rgba(255,255,255,0.3), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .ready-button:hover::after {
    opacity: 1;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.05); }
  }

  @media (max-width: 768px) {
    .ready-text {
      font-size: 3.5rem;
    }
    
    .ready-subtext {
      font-size: 1.2rem;
    }
    
    .ready-button {
      padding: 1rem 2rem;
      font-size: 1.2rem;
    }
  }
`;

// Inject styles
const styleTag = document.createElement('style');
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);

export default GetReadyPage;