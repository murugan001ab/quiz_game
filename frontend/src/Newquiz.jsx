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

  // ✅ Timer effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev + 1;

        // Enable Next button after 3s for non-last questions
        if (newTime >= 3 && !enableNext && index < questions.length - 1) {
          setEnableNext(true);
        }

        // Enable Finish button after 3s on last question
        if (newTime >= 3 && !enableFinish && index >= questions.length - 1) {
          setEnableFinish(true);
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [enableNext, enableFinish, index, questions.length]);

  // ✅ Reset timer and states when question changes
  useEffect(() => {
    setTimer(0);
    setEnableNext(false);
    setEnableFinish(false);
    setSelectedOption(null);
  }, [index]);

  // ✅ WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/index/');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setConnectionStatus('connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Prevent overriding the initial 0 with backend’s default
      if (typeof data.index === 'number' && data.index !== index) {
        console.log("Received index update:", data.index);
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

  // ✅ Fetch questions
  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/questions/')
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
        // Always start at first question
        setIndex(0);
      })
      .catch((err) => {
        console.error('Error fetching questions:', err);
        setLoading(false);
      });
  }, [setIndex]);

  // ✅ Change index safely
  const changeIndex = (newIndex) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    const lastIndex = questions.length - 1;
    const isActuallyOnLast = index >= lastIndex;
    const isTryingToGoNextFromLast = newIndex > lastIndex;

    if (isActuallyOnLast && isTryingToGoNextFromLast) {
      // Finish Quiz navigation
      navigate('/results');
    } else {
      const validatedIndex = Math.min(newIndex, lastIndex);
      console.log("Sending new index:", validatedIndex);

      socket.send(
        JSON.stringify({
          index: validatedIndex,
          type: 'index_update',
        })
      );
    }
  };

  // Loading / no questions
  if (loading) return <div className="loading">Loading questions...</div>;
  if (questions.length === 0) return <div>No questions available</div>;

  const currentQuestion = questions[index] || {};
  const isLastQuestion = index >= questions.length - 1;
  const questionOptions = currentQuestion.options || [];

  return (
    <div className="quiz-container">
      {/* Timer */}
      <div className="timer-display">
        Elapsed Time: {timer}s{' '}
        {!isLastQuestion && timer < 3 && `(Next unlocks in ${3 - timer}s)`}
        {isLastQuestion && timer < 3 && `(Finish unlocks in ${3 - timer}s)`}
      </div>

      {/* Question Header */}
      <div className="question-header">
        Question {index + 1} of {questions.length}
      </div>

      {/* Question Text */}
      <h2>{currentQuestion.question_text}</h2>

      {/* Options */}
      <div className="options">
        {questionOptions.map((opt, i) => (
          <div
            key={i}
            className={`option ${selectedOption === i ? 'selected' : ''}`}
            onClick={() => setSelectedOption(i)}
          >
            {opt}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="navigation">
        <button
          onClick={() => changeIndex(index + 1)}
          disabled={isLastQuestion ? !enableFinish : !enableNext}
          className={
            isLastQuestion ? (!enableFinish ? 'disabled-next' : '') : (!enableNext ? 'disabled-next' : '')
          }
        >
          {isLastQuestion ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default NewQuiz;
