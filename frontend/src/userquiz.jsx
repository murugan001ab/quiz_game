import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';
import { useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const navigate = useNavigate();
  const { index, setIndex, aname,BASE_URL } = useContext(AdminContext);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(20);
  const [score, setScore] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  const [socket, setSocket] = useState(null);
  const [timeExpired, setTimeExpired] = useState(false);
  const [showFinishButton, setShowFinishButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminId, setAdminId] = useState(localStorage.getItem('adminId') || null);

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`ws://${BASE_URL}/ws/index/`);

    console.log("Stored Admin ID:", adminId);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.index !== undefined) {
        setIndex(data.index);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws) ws.close();
    };
  }, [setIndex]);

  // Fetch questions
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://${BASE_URL}/fetch/admin/${adminId}`);
        setQuestions(response.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);

  // Reset quiz state when index changes
  useEffect(() => {
    if (questions.length === 0) return;
    
    setTimer(20);
    setIsFrozen(false);
    setTimeExpired(false);
    setSelectedAnswers(prev => ({ ...prev, [index]: undefined }));
    
    // Check if we should show finish button when index changes
    const isLastQuestion = index === questions.length - 1;
    setShowFinishButton(isLastQuestion && (isFrozen || timeExpired));
  }, [index, questions]);

  // Timer countdown
  useEffect(() => {
    if (questions.length === 0 || isFrozen) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFrozen(true);
          setTimeExpired(true);
          
          // Check if we should show finish button when timer expires
          if (index === questions.length - 1) {
            setShowFinishButton(true);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questions, index, isFrozen]);

  const handleOptionClick = (option) => {
    if (isFrozen || selectedAnswers[index] !== undefined || timeExpired) return;

    const currentQuestion = questions[index];
    const isCorrect = option === currentQuestion.correct_answer;

    setSelectedAnswers(prev => ({ ...prev, [index]: option }));
    if (isCorrect) setScore(prev => prev + 1);
    setIsFrozen(true);
    
    // Check if we should show finish button after answering
    if (index === questions.length - 1) {
      setShowFinishButton(true);
    }
  };

  const handleQuizFinished = () => {

    // const admin_id='5';


    console.log("Quiz finished. Final score:", score,aname, adminId);
    // Submit score to backend
    axios.post(`http://${BASE_URL}/users/`, {
      aname:aname,
      score:score,
      admin_id:adminId
    })
    .then(() => {
      navigate('/wait');
    })
    .catch(err => {
      console.error("Error submitting score:", err);
      navigate('/wait');
    });
  };

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <p style={styles.loadingText}>No questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[index];
  const showAnswer = isFrozen && selectedAnswers[index] !== undefined;
  const hasSelection = selectedAnswers[index] !== undefined;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.progress}>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${((index + 1) / questions.length) * 100}%`
            }}></div>
          </div>
          <div style={styles.progressText}>
            Question {index + 1} of {questions.length}
          </div>
        </div>
        
        <div style={styles.timerContainer}>
          <div style={styles.timer}>
            ⏱️ {timer}s
            {timeExpired && <span style={styles.timeUp}>Time's up!</span>}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div style={styles.questionCard}>
        <h3 style={styles.questionText}>{currentQuestion.question_text}</h3>
        
        {/* Options */}
        <div style={styles.options}>
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              disabled={isFrozen || timeExpired}
              style={{
                ...styles.option,
                ...(selectedAnswers[index] === option ? styles.selectedOption : {}),
                ...(showAnswer && option === currentQuestion.correct_answer ? styles.correctOption : {}),
                ...(showAnswer && 
                    selectedAnswers[index] === option && 
                    option !== currentQuestion.correct_answer ? styles.incorrectOption : {}),
                ...(hasSelection && selectedAnswers[index] !== option ? styles.nonSelectedOption : {})
              }}
            >
              <span style={styles.optionLetter}>
                {String.fromCharCode(65 + idx)}.
              </span>
              <span style={styles.optionText}>{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      

      {/* Finish Button - Only shows on last question after answer/timeout */}
      {showFinishButton && (
        <button 
          onClick={handleQuizFinished}
          style={styles.finishButton}
        >
          Finish Quiz 🏁
        </button>
      )}
    </div>
  );
};




// Updated styling with cursor: not-allowed and opacity: 0.7
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#F3F3E0',
    minHeight: '100vh',
    color: '#183B4E',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '25px',
  },
  progress: {
    width: '100%',
  },
  progressBar: {
    height: '8px',
    backgroundColor: 'rgba(24, 59, 78, 0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#183B4E',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: '14px',
    color: '#183B4E',
    textAlign: 'right',
    fontWeight: '500',
  },
  timerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timer: {
    backgroundColor: '#183B4E',
    color: '#F3F3E0',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  timeUp: {
    marginLeft: '5px',
    color: '#F3F3E0',
    opacity: 0.8,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '25px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(24, 59, 78, 0.1)',
    border: '1px solid rgba(24, 59, 78, 0.1)',
  },
  questionText: {
    fontSize: '20px',
    marginBottom: '25px',
    color: '#183B4E',
    lineHeight: '1.5',
    fontWeight: '600',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: 'rgba(24, 59, 78, 0.03)',
    border: '2px solid rgba(24, 59, 78, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'left',
    fontSize: '16px',
    '&:hover:enabled': {
      backgroundColor: 'rgba(24, 59, 78, 0.08)',
    }
  },
  selectedOption: {
    backgroundColor: '#183B4E',
    color: '#F3F3E0',
    borderColor: '#183B4E',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(24, 59, 78, 0.2)',
  },
  correctOption: {
    borderColor: '#fefefeff',
  },
  incorrectOption: {
    borderColor: '#ffffffff',
  },
  // Changed style for non-selected options
  nonSelectedOption: {
    opacity: 0.7, 
    cursor: 'not-allowed',
  },
  optionLetter: {
    fontWeight: 'bold',
    marginRight: '10px',
    fontSize: '18px',
    minWidth: '24px',
  },
  optionText: {
    flex: 1,
  },
  timeUpMessage: {
    backgroundColor: 'rgba(24, 59, 78, 0.05)',
    color: '#183B4E',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
    border: '1px dashed rgba(24, 59, 78, 0.2)',
  },
  finishButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#183B4E',
    color: '#F3F3E0',
    border: 'none',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '20px',
    '&:hover': {
      backgroundColor: '#102a3a',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(24, 59, 78, 0.3)',
    }
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#F3F3E0',
  },
  loadingSpinner: {
    border: '5px solid rgba(24, 59, 78, 0.1)',
    borderTop: '5px solid #183B4E',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#183B4E',
    fontWeight: '500',
  },
};

// Add global styles
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #F3F3E0;
    color: #183B4E;
  }
  
  * {
    box-sizing: border-box;
  }
  
  button {
    outline: none;
    font-family: inherit;
  }
`;

// Inject global styles
const styleElement = document.createElement('style');
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

export default QuizPage; there is mistake in css that is if i use in mobile options with is not fixed so give me proper mobile reposive css atractive style
