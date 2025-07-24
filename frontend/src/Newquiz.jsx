import { useEffect, useState, useContext } from 'react';
import './App.css';
import axios from 'axios';
import { AdminContext } from './AdminProvider';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [finish, setFinish] = useState(false);
  // FIX: include socket in context
  const { index, setIndex, socket, setSocket } = useContext(AdminContext);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/index/');  // Connect to Django WebSocket
    ws.onopen = () => console.log('Connected');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setIndex(data.index);  // Receive updated index from server
    };
    setSocket(ws);
    // FIX: cleanup socket on unmount
    return () => {
      ws.close();
      setSocket(null);
    };
  }, [setIndex, setSocket]);

  // FIX: Next/Prev logic
  const increaseIndex = () => {
    if (!socket) return;
    const newIndex = index + 1;
    socket.send(JSON.stringify({ index: newIndex }));  // Send new index to server
  };
  const decreaseIndex = () => {
    if (!socket) return;
    const newIndex = index - 1;
    socket.send(JSON.stringify({ index: newIndex }));  // Send new index to server
  };

  // Fetch questions once
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/questions/")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions", err));
  }, []);

  // Watch for index changes and check for finish
  useEffect(() => {
    if (questions.length > 0 && index === questions.length - 1) {
      setFinish(true);
    } else {
      setFinish(false);
    }
  }, [index, questions]);

  if (questions.length === 0) return <p>Loading questions...</p>;

  const currentQuestion = questions[index] || {};

  return (
    <div style={{ padding: 20 }}>
      <h2>Question {index + 1}</h2>
      <p><strong>{currentQuestion.question_text}</strong></p>
      <ul>
        {(currentQuestion.options || []).map((opt, i) => (
          <li key={i}>
            <label>
              <input type="radio" name="option" />
              {opt}
            </label>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 20 }}>
        {/* FIX: Button logic */}
        <button onClick={decreaseIndex} disabled={index === 0}>Previous</button>
        {finish
          ? <button>Finish</button>
          : <button onClick={increaseIndex} disabled={index === questions.length - 1}>Next</button>
        }
      </div>
    </div>
  );
};

export default Quiz;