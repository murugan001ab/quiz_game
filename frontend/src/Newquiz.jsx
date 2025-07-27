import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';
import { useNavigate } from 'react-router-dom';

const NewQuiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const { index, setIndex, socket, setSocket } = useContext(AdminContext);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [timer, setTimer] = useState(0);
  const [enableNext, setEnableNext] = useState(false);
  const [enableFinish, setEnableFinish] = useState(false);

  // Timer effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev + 1;
        if (newTime >= 3 && !enableNext && index < questions.length - 1) {
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
    setSelectedOption(null);
  }, [index]);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/index/');

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
      .get('http://127.0.0.1:8000/questions/')
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
    <div style={styles.loadingContainer}>
      <div style={styles.loadingSpinner}></div>
      <p style={styles.loadingText}>Loading questions...</p>
    </div>
  );
  
  if (questions.length === 0) return (
    <div style={styles.noQuestionsContainer}>
      <h2 style={styles.noQuestionsTitle}>No questions available</h2>
      <p style={styles.noQuestionsText}>Please check back later or contact the administrator.</p>
    </div>
  );

  const currentQuestion = questions[index] || {};
  const isLastQuestion = index >= questions.length - 1;
  const questionOptions = currentQuestion.options || [];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.quizTitle}>Quiz Master</h1>
        <div style={styles.timerDisplay}>
          ⏱️ Elapsed: {timer}s
          {!isLastQuestion && timer < 3 && (
            <span style={styles.timerHint}> (Next in {3 - timer}s)</span>
          )}
          {isLastQuestion && timer < 3 && (
            <span style={styles.timerHint}> (Finish in {3 - timer}s)</span>
          )}
        </div>
      </div>

      {/* Question Progress */}
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${((index + 1) / questions.length) * 100}%`
            }}
          ></div>
        </div>
        <div style={styles.progressText}>
          Question {index + 1} of {questions.length}
        </div>
      </div>

      {/* Question Card */}
      <div style={styles.questionCard}>
        <h2 style={styles.questionText}>{currentQuestion.question_text}</h2>
        
        {/* Options */}
        <div style={styles.optionsContainer}>
          {questionOptions.map((opt, i) => (
            <div
              key={i}
              style={{
                ...styles.option,
                ...(selectedOption === i ? styles.selectedOption : {}),
              }}
              onClick={() => setSelectedOption(i)}
            >
              <span style={styles.optionLetter}>
                {String.fromCharCode(65 + i)}.
              </span>
              <span style={styles.optionText}>{opt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <button
          style={{
            ...styles.navButton,
            ...(isLastQuestion ? 
              (!enableFinish ? styles.disabledButton : styles.finishButton) : 
              (!enableNext ? styles.disabledButton : styles.nextButton)
            )
          }}
          onClick={() => changeIndex(index + 1)}
          disabled={isLastQuestion ? !enableFinish : !enableNext}
        >
          {isLastQuestion ? 'Finish Quiz 🏁' : 'Next Question →'}
        </button>
      </div>
    </div>
  );
};

// Styling using #183B4E (dark blue) and #F3F3E0 (light cream)
const styles = {

  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#F3F3E0', // Light cream background
    minHeight: '100vh',
    color: '#183B4E', // Dark blue text
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid rgba(24, 59, 78, 0.1)',
  },
  quizTitle: {
    fontSize: '2.2rem',
    margin: 0,
    fontWeight: '700',
    color: '#183B4E',
    letterSpacing: '0.5px',
  },
  timerDisplay: {
    backgroundColor: '#183B4E', // Dark blue
    color: '#F3F3E0', // Light cream text
    padding: '0.6rem 1.2rem',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: '500',
    boxShadow: '0 2px 8px rgba(24, 59, 78, 0.2)',
  },
  timerHint: {
    opacity: 0.9,
    fontSize: '0.9rem',
    marginLeft: '0.5rem',
  },
  progressContainer: {
    marginBottom: '2rem',
  },
  progressBar: {
    height: '10px',
    backgroundColor: 'rgba(24, 59, 78, 0.1)',
    borderRadius: '5px',
    marginBottom: '0.5rem',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#183B4E', // Dark blue
    borderRadius: '5px',
    transition: 'width 0.3s ease',
  },
  progressText: {
    textAlign: 'right',
    color: '#183B4E',
    fontSize: '1rem',
    fontWeight: '500',
    opacity: 0.8,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(24, 59, 78, 0.08)',
    marginBottom: '2rem',
    border: '1px solid rgba(24, 59, 78, 0.1)',
  },
  questionText: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
    color: '#183B4E',
    fontWeight: '600',
    lineHeight: '1.5',
  },
  optionsContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.2rem',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.2rem 1.8rem',
    borderRadius: '8px',
    backgroundColor: 'rgba(24, 59, 78, 0.03)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid rgba(24, 59, 78, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(24, 59, 78, 0.06)',
    }
  },
  selectedOption: {
    backgroundColor: '#183B4E', // Dark blue
    color: '#F3F3E0', // Light cream text
    borderColor: '#183B4E',
    transform: 'translateY(-3px)',
    boxShadow: '0 4px 10px rgba(24, 59, 78, 0.2)',
  },
  optionLetter: {
    fontWeight: '700',
    marginRight: '1.2rem',
    fontSize: '1.3rem',
    minWidth: '30px',
  },
  optionText: {
    flex: 1,
    fontSize: '1.1rem',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  navButton: {
    padding: '1.1rem 2.2rem',
    borderRadius: '50px',
    border: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  disabledButton: {
    backgroundColor: 'rgba(24, 59, 78, 0.1)',
    color: 'rgba(24, 59, 78, 0.4)',
    cursor: 'not-allowed',
  },
  nextButton: {
    backgroundColor: '#183B4E', // Dark blue
    color: '#F3F3E0', // Light cream text
    '&:hover:enabled': {
      backgroundColor: '#102a3a',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(24, 59, 78, 0.3)',
    }
  },
  finishButton: {
    backgroundColor: '#d4a017', // Gold accent
    color: '#183B4E',
    fontWeight: '700',
    '&:hover:enabled': {
      backgroundColor: '#c1910e',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(212, 160, 23, 0.3)',
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
    width: '60px',
    height: '60px',
    animation: 'spin 1s linear infinite',
    marginBottom: '1.5rem',
  },
  loadingText: {
    fontSize: '1.3rem',
    color: '#183B4E',
    fontWeight: '500',
  },
  noQuestionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#F3F3E0',
    textAlign: 'center',
    padding: '2rem',
  },
  noQuestionsTitle: {
    fontSize: '2rem',
    color: '#183B4E',
    marginBottom: '1rem',
    fontWeight: '700',
  },
  noQuestionsText: {
    fontSize: '1.2rem',
    color: 'rgba(24, 59, 78, 0.7)',
    maxWidth: '500px',
    lineHeight: '1.6',
  },
};

// Global styles
const globalStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    background-color: #F3F3E0;
    color: #183B4E;
  }
  
  * {
    box-sizing: border-box;
  }
  
  button:enabled {
    cursor: pointer;
  }
`;

// Inject global styles
const styleElement = document.createElement('style');
styleElement.innerHTML = globalStyles;
document.head.appendChild(styleElement);

export default NewQuiz;