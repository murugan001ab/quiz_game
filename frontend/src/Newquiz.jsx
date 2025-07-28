import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';
import { useNavigate } from 'react-router-dom';

const NewQuiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { index, setIndex, socket, setSocket,BASE_URL } = useContext(AdminContext);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [timer, setTimer] = useState(0);
  const [enableNext, setEnableNext] = useState(false);
  const [enableFinish, setEnableFinish] = useState(false);
  const [adminId, setAdminId] = useState(localStorage.getItem('adminId') || null);
  // Timer effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev + 1;
        if (newTime >= 0 && !enableNext && index < questions.length - 1) {
          setEnableNext(true);
        }
        if (newTime >= 3 && !enableFinish && index >= questions.length - 1) {
          setEnableFinish(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [enableNext, enableFinish, index, questions.length]);

  // Reset timer and states when question changes
  useEffect(() => {
    setTimer(0);
    setEnableNext(false);
    setEnableFinish(false);
  }, [index]);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`ws://${BASE_URL}/ws/index/`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setConnectionStatus('connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (typeof data.index === 'number' && data.index !== index) {
        setIndex(data.index);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
      setSocket(null);
    };

    return () => ws.close();
  }, [setIndex, setSocket, index]);

  // Fetch questions
  useEffect(() => {
    axios
      .get(`http://${BASE_URL}/questions/${adminId}`)
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
        setIndex(0);
      })
      .catch((err) => {
        console.error('Error fetching questions:', err);
        setLoading(false);
      });
  }, [setIndex]);

  const changeIndex = (newIndex) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const lastIndex = questions.length - 1;
    const isActuallyOnLast = index >= lastIndex;
    const isTryingToGoNextFromLast = newIndex > lastIndex;

    if (isActuallyOnLast && isTryingToGoNextFromLast) {
      navigate('/results');
    } else {
      const validatedIndex = Math.min(newIndex, lastIndex);
      socket.send(
        JSON.stringify({
          index: validatedIndex,
          type: 'index_update',
        })
      );
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading questions...</p>
    </div>
  );
  
  if (questions.length === 0) return (
    <div className="no-questions-container">
      <h2 className="no-questions-title">No questions available</h2>
      <p className="no-questions-text">Please check back later or contact the administrator.</p>
    </div>
  );

  const currentQuestion = questions[index] || {};
  const isLastQuestion = index >= questions.length - 1;
  const questionOptions = currentQuestion.options || [];

  return (
    <div className="quiz-container">
      {/* Header */}
      <div className="quiz-header">
        <h1 className="quiz-title">Quiz Control Panel</h1>
        <div className={`connection-status ${connectionStatus}`}>
          {connectionStatus === 'connected' ? '✅ Connected' : 
           connectionStatus === 'connecting' ? '🔄 Connecting...' :
           connectionStatus === 'error' ? '⚠️ Connection Error' : '❌ Disconnected'}
        </div>
      </div>

      {/* Timer and Progress */}
      <div className="quiz-meta">
        <div className="timer-display">
          ⏱️ {timer}s
          {!isLastQuestion && timer < 3 && (
            <span className="timer-hint"> (Next in {3 - timer}s)</span>
          )}
          {isLastQuestion && timer < 3 && (
            <span className="timer-hint"> (Finish in {3 - timer}s)</span>
          )}
        </div>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${((index + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Question {index + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="question-card">
        <h2 className="question-text">{currentQuestion.question_text}</h2>
        
        {/* Options List */}
        <div className="options-list">
          {questionOptions.map((opt, i) => (
            <div key={i} className="option-item">
              <span className="option-letter">{String.fromCharCode(65 + i)}.</span>
              <span className="option-text">{opt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation-controls">
        <button
          className={`nav-button ${isLastQuestion ? 'finish' : 'next'} ${
            (isLastQuestion ? !enableFinish : !enableNext) ? 'disabled' : ''
          }`}
          onClick={() => changeIndex(index + 1)}
          disabled={isLastQuestion ? !enableFinish : !enableNext}
        >
          {isLastQuestion ? 'Finish Quiz 🏁' : 'Next Question →'}
        </button>
      </div>

      <style jsx>{`
        .quiz-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Roboto', sans-serif;
          background-color: #f8f9fa;
          min-height: 100vh;
          color: #2c3e50;
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .quiz-title {
          font-size: 1.8rem;
          margin: 0;
          color: #2c3e50;
          font-weight: 700;
        }

        .connection-status {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .connection-status.connected {
          background-color: #d4edda;
          color: #155724;
        }

        .connection-status.connecting {
          background-color: #fff3cd;
          color: #856404;
        }

        .connection-status.error, .connection-status.disconnected {
          background-color: #f8d7da;
          color: #721c24;
        }

        .quiz-meta {
          margin-bottom: 2rem;
        }

        .timer-display {
          background-color: #343a40;
          color: white;
          padding: 0.6rem 1.2rem;
          border-radius: 20px;
          display: inline-block;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .timer-hint {
          opacity: 0.8;
          margin-left: 0.5rem;
        }

        .progress-container {
          margin-top: 1rem;
        }

        .progress-bar {
          height: 8px;
          background-color: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background-color: #3498db;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: right;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .question-card {
          background: white;
          border-radius: 10px;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .question-text {
          font-size: 1.4rem;
          margin-top: 0;
          margin-bottom: 2rem;
          line-height: 1.4;
          color: #2c3e50;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .option-item {
          display: flex;
          align-items: flex-start;
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .option-letter {
          font-weight: bold;
          margin-right: 1rem;
          color: #3498db;
          min-width: 1.5rem;
        }

        .option-text {
          flex: 1;
          font-size: 1.1rem;
        }

        .navigation-controls {
          display: flex;
          justify-content: flex-end;
        }

        .nav-button {
          padding: 0.8rem 1.8rem;
          border-radius: 6px;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-button.next {
          background-color: #3498db;
          color: white;
        }

        .nav-button.next:not(.disabled):hover {
          background-color: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(41, 128, 185, 0.3);
        }

        .nav-button.finish {
          background-color: #28a745;
          color: white;
        }

        .nav-button.finish:not(.disabled):hover {
          background-color: #218838;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
        }

        .nav-button.disabled {
          background-color: #e9ecef;
          color: #adb5bd;
          cursor: not-allowed;
        }

        /* Loading states */
        .loading-container, .no-questions-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          padding: 2rem;
          text-align: center;
        }

        .loading-spinner {
          border: 4px solid rgba(52, 152, 219, 0.2);
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 1.5rem;
        }

        .loading-text {
          font-size: 1.2rem;
          color: #2c3e50;
        }

        .no-questions-title {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 1rem;
        }

        .no-questions-text {
          font-size: 1rem;
          color: #6c757d;
          max-width: 400px;
          line-height: 1.5;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .quiz-container {
            padding: 1.5rem;
          }

          .quiz-title {
            font-size: 1.5rem;
          }

          .question-card {
            padding: 1.5rem;
          }

          .question-text {
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .quiz-container {
            padding: 1rem;
          }

          .quiz-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .question-card {
            padding: 1rem;
          }

          .question-text {
            font-size: 1.1rem;
            margin-bottom: 1.5rem;
          }

          .option-item {
            padding: 0.8rem;
          }

          .option-text {
            font-size: 1rem;
          }

          .nav-button {
            width: 100%;
            justify-content: center;
            padding: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NewQuiz;