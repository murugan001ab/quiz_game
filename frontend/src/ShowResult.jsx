import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/result/');
    
    ws.onopen = () => {
      console.log('Connected to results WebSocket');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'results_control' && data.show) {
        setShowResults(true);
        fetchResults();
      }
    };

    return () => ws.close();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/users/");
      const sortedResults = [...response.data].sort((a, b) => b.score - a.score);
      setResults(sortedResults);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  const showResultsToAll = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'show_results'
      }));
      console.log("Show results command sent to all clients");
    }
  };

  const goToAdminPanel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div style={containerStyle}>
      <h1>Quiz Results</h1>
      
      {!showResults ? (
        <button onClick={showResultsToAll} disabled={loading}>
          {loading ? 'Loading...' : 'Show Results To Everyone'}
        </button>
      ) : (
        <>
          {results.length > 0 ? (
            <div style={resultsContainer}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No results available</p>
          )}
          <button onClick={goToAdminPanel} style={adminButtonStyle}>
            Go to Admin Panel
          </button>
        </>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  textAlign: 'center'
};

const resultsContainer = {
  margin: '20px 0'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '20px 0'
};

const adminButtonStyle = {
  marginTop: '20px',
  padding: '10px 20px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default ResultsPage;