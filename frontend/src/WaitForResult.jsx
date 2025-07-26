import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WaitForResult = () => {
  const navigate = useNavigate();

  // Redirect to results page after 5 seconds (simulating processing time)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate('/results'); // Change to your actual results page route
//     }, 5000);

//     return () => clearTimeout(timer);
//   }, [navigate]);

  return (
    <div className="waiting-container">
      <div className="waiting-content">
        <h1 className="waiting-text">WAIT FOR RESULTS</h1>
        <p className="waiting-subtext">We're calculating your score...</p>
        
        <div className="loading-animation">
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
          <div className="loading-dot"></div>
        </div>
        
        {/* <div className="progress-bar">
          <div className="progress-fill"></div>
        </div> */}
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .waiting-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    font-family: 'Poppins', sans-serif;
    color: white;
    text-align: center;
  }

  .waiting-content {
    max-width: 800px;
    padding: 2rem;
  }

  .waiting-text {
    font-size: 4.5rem;
    font-weight: 800;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 4px;
    color: #f4b41a;
    text-shadow: 3px 3px 0 rgba(0,0,0,0.2);
    animation: pulse 1.5s infinite alternate;
  }

  .waiting-subtext {
    font-size: 1.5rem;
    margin: 2rem 0 3rem;
    opacity: 0.9;
  }

  .loading-animation {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin: 2rem 0;
  }

  .loading-dot {
    width: 20px;
    height: 20px;
    background: #4a6bff;
    border-radius: 50%;
    animation: bounce 1s infinite ease-in-out;
  }

  .loading-dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    margin-top: 3rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    width: 0;
    background: linear-gradient(90deg, #4a6bff, #6a8eff);
    border-radius: 4px;
    animation: progress 5s linear forwards;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.05); }
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
  }

  @keyframes progress {
    0% { width: 0; }
    100% { width: 100%; }
  }

  @media (max-width: 768px) {
    .waiting-text {
      font-size: 3rem;
      letter-spacing: 2px;
    }
    
    .waiting-subtext {
      font-size: 1.2rem;
    }
    
    .loading-dot {
      width: 15px;
      height: 15px;
    }
  }
`;

// Inject styles
const styleTag = document.createElement('style');
styleTag.innerHTML = styles;
document.head.appendChild(styleTag);

export default WaitForResult;