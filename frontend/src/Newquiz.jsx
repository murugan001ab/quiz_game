import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';

const NewQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const { index, setIndex, socket, setSocket } = useContext(AdminContext);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [timer, setTimer] = useState(0); // Changed to count up
  const [enableNext, setEnableNext] = useState(false);

  // Timer effect (counts up)
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer(prev => {
        const newTime = prev + 1;
        // Enable Next button after 15 seconds
        if (newTime >= 15 && !enableNext) {
          setEnableNext(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [enableNext]);

  // Reset timer when question changes
  useEffect(() => {
    setTimer(0);
    setEnableNext(false);
  }, [index]);

  // WebSocket connection (unchanged)
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/index/');
    
    ws.onopen = () => {
      console.log('WebSocket Connected');
      setConnectionStatus('connected');
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
      setConnectionStatus('error');
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnectionStatus('disconnected');
      setSocket(null);
    };

    return () => ws.close();
  }, [setIndex, setSocket]);

  // Fetch questions (unchanged)
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/questions/")
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, []);

  const changeIndex = (newIndex) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    const validatedIndex = Math.max(0, Math.min(newIndex, questions.length - 1));
    socket.send(JSON.stringify({ index: validatedIndex, type: 'index_update' }));
  };

  if (loading) return <div className="loading">Loading questions...</div>;
  if (questions.length === 0) return <div>No questions available</div>;

  const currentQuestion = questions[index] || {};

  return (
    <div className="quiz-container">
      <div className="timer-display">
        Elapsed Time: {timer}s {timer < 15 && "(Next button unlocks in " + (15 - timer) + "s)"}
      </div>

      <div className="question-header">
        Question {index + 1} of {questions.length}
      </div>

      <h2>{currentQuestion.question_text}</h2>

      <div className="options">
        {currentQuestion.options.map((opt, i) => (
          <div 
            key={i} 
            className={`option ${selectedOption === i ? 'selected' : ''}`}
            onClick={() => setSelectedOption(i)}
          >
            {opt}
          </div>
        ))}
      </div>

      <div className="navigation">
      
        
        {/* Next/Finish button - controlled by timer */}
        <button 
          onClick={() => changeIndex(index + 1)} 
          disabled={index >= questions.length - 1 || !enableNext}
          className={!enableNext ? 'disabled-next' : ''}
        >
          {index >= questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default NewQuiz;