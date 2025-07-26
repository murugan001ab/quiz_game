import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';
import { useNavigate } from 'react-router-dom';



const QuizPage = () => {
  const navigate=useNavigate();
  const { index, setIndex } = useContext(AdminContext);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isFinshed, setIsFinished] = useState(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/index/');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setIndex(data.index);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
    };

    return () => {
      if (ws) ws.close();
    };
  }, [setIndex]);

  // Fetch questions
  useEffect(() => {
    axios.get("http://localhost:8000/questions/")
      .then(res => setQuestions(res.data))
      .catch(err => console.error("Error fetching questions:", err));
  }, []);

  // Reset quiz state when index changes
  useEffect(() => {
    setTimer(15);
    setIsFrozen(false);
    setTimeExpired(false);
    setSelectedAnswers(prev => ({ ...prev, [index]: undefined }));
  }, [index]);

  // Timer countdown
  useEffect(() => {
    if (questions.length === 0 || isFrozen) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setIsFrozen(true);
          setTimeExpired(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questions, index, isFrozen]);

  useEffect(() => {
    if(index===questions.length-1 && (isFrozen|| timeExpired)) {
    setIsFinished(true);    }
    
  },[isFrozen]);

  const handleOptionClick = (option) => {
    if (isFrozen || selectedAnswers[index] || timeExpired) return;

    const currentQuestion = questions[index];
    const isCorrect = option === currentQuestion.correct_answer;

    setSelectedAnswers(prev => ({ ...prev, [index]: option }));
    if (isCorrect) setScore(prev => prev + 1);
    setIsFrozen(true);
  };

  if (questions.length === 0) {
    return <div className="loading">Loading questions...</div>;
  }


  const handleQuizFinished = () => {
    navigate('/wait');
    
  }
    

  // if (index >= questions.length) {
  //   return (
  //     <div className="quiz-completed">
  //       <h2>Quiz Completed!</h2>
  //       <p>Your score: {score} out of {questions.length}</p>
  //     </div>
  //   );
  // }

  const currentQuestion = questions[index];
  const showAnswer = isFrozen && selectedAnswers[index] !== undefined;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Question {index + 1} of {questions.length}</h2>
        <div className="timer">
          Time left: {timer} sec
          {timeExpired && <span className="time-up">Time's up!</span>}
        </div>
      </div>

      <div className="question-card">
        <h3>{currentQuestion.question_text}</h3>
        
        <div className="options">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={isFrozen || timeExpired}
              className={`
                ${selectedAnswers[index] === option ? 'selected' : ''}
                ${showAnswer && option === currentQuestion.correct_answer ? 'correct' : ''}
                ${showAnswer && selectedAnswers[index] === option && !currentQuestion.correct_answer ? 'incorrect' : ''}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {timeExpired && !selectedAnswers[index] && (
        <div className="time-up-message">
          <p>Time's up! The correct answer was: <strong>{currentQuestion.correct_answer}</strong></p>
        </div>
      )}

      {showAnswer && (
        <div className="answer-feedback">
          {selectedAnswers[index] === currentQuestion.correct_answer ? (
            <p className="correct">Correct answer!</p>
          ) : (
            <p className="incorrect">
              The correct answer was: <strong>{currentQuestion.correct_answer}</strong>
            </p>
          )}
        </div>
      )}

      {isFinshed && <button onClick={()=>handleQuizFinished()}>Finish Quiz</button>}
    </div>
  );
};

// Add these styles
const styles = `
  .quiz-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .quiz-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
  }
  
  .timer {
    padding: 5px 10px;
    background-color: #e3f2fd;
    border-radius: 20px;
    font-weight: bold;
  }
  
  .time-up {
    color: #c62828;
    margin-left: 10px;
  }
  
  .question-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .options button {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .options button:disabled {
    cursor: not-allowed;
  }
  
  .selected {
    background-color: #e3f2fd !important;
  }
  
  .correct {
    background-color: #e8f5e9 !important;
    color: #2e7d32;
  }
  
  .incorrect {
    background-color: #ffebee !important;
    color: #c62828;
  }
  
  .time-up-message, .answer-feedback {
    text-align: center;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
  
  .time-up-message {
    background-color: #fff3e0;
    color: #e65100;
  }
  
  .loading, .quiz-completed {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default QuizPage;