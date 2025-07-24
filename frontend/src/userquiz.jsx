import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);
  const [isFrozen, setIsFrozen] = useState(false);
  const { index } = useContext(AdminContext);
  const [currentIndex, setCurrentIndex] = useState(index);

  // Sync currentIndex with context index
  useEffect(() => {
    setCurrentIndex(index);
    setTimer(15);
    setIsFrozen(false);
  }, [index]);

  // Fetch questions
  useEffect(() => {
    axios.get("http://localhost:8000/questions/")
      .then(res => setQuestions(res.data))
      .catch(err => console.error(err));
  }, []);

  // Timer effect
  useEffect(() => {
    if (questions.length === 0 || isFrozen) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          setIsFrozen(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [questions, currentIndex, isFrozen]);

  const handleOptionClick = (option) => {
    if (isFrozen || selectedAnswers[currentIndex]) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = option === currentQuestion.correct_answer;

    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: option }));

    if (isCorrect) setScore(prev => prev + 1);

    setIsFrozen(true);  // Freeze options after selecting
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  const current = questions[currentIndex];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Question {currentIndex + 1} of {questions.length}</h2>
      <p><strong>{current.question_text}</strong></p>
      <p>Time left: {timer} sec</p>
      {current.options.map((option, idx) => (
        <button
          key={idx}
          disabled={isFrozen || selectedAnswers[currentIndex]}
          onClick={() => handleOptionClick(option)}
          style={{
            margin: '10px',
            backgroundColor: selectedAnswers[currentIndex] === option ? 'lightblue' : ''
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default QuizPage;