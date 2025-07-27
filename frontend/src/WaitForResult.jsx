import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const WaitForResult = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // WebSocket connection and message handling
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/result/');
    
    ws.onopen = () => {
      console.log('Connected to results WebSocket');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
      
      if (data.type === 'results_control' && data.show) {
        setLoading(true);
        fetchResults();
      }
    };

    return () => ws.close();
  }, []);

  // Fetch results from API
  const fetchResults = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/");
      const sortedResults = [...response.data].sort((a, b) => b.score - a.score);
      setResults(sortedResults);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false); // This was missing - crucial to hide loading state
    }
  };

  return (
    <div className="results-container">
      {loading ? (
        <div className="waiting-screen">
          <h1>WAITING FOR RESULTS</h1>
          <p>The quiz master will reveal results soon...</p>
          <div className="loading-animation">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      ) : (
        <div className="results-display">
          <h1>Quiz Results</h1>
          
          {results.length > 0 ? (
            <table className="results-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((participant, index) => (
                  <tr key={participant.id}>
                    <td>{index + 1}</td>
                    <td>{participant.name}</td>
                    <td>{participant.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No results available</p>
          )}
          
          <button onClick={() => navigate('/quiz')}>
            Back to Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default WaitForResult;