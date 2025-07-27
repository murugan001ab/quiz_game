import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminContext } from './AdminProvider';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const { adminId } = useContext(AdminContext);

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
      console.log("Fetching results for admin:", adminId);
      
      // Include adminId in the request
      const response = await axios.get(`http://127.0.0.1:8000/users/?admin_id=${adminId}`);
      
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
        type: 'show_results',
        adminId: adminId  // Include adminId in the WebSocket message
      }));
      console.log("Show results command sent to all clients for admin:", adminId);
    }
  };

  const goToAdminPanel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div style={containerStyle}>
      <h1>Quiz Results</h1>
      <p>Admin ID: {adminId}</p>
      
      {!showResults ? (
        <button 
          onClick={showResultsToAll} 
          disabled={loading}
          style={buttonStyle}
        >
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
                    <tr key={p.id} style={i % 2 === 0 ? evenRowStyle : oddRowStyle}>
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

// Styles
const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  textAlign: 'center',
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const resultsContainer = {
  margin: '20px 0',
  overflowX: 'auto'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  margin: '20px 0',
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden'
};

const evenRowStyle = {
  backgroundColor: '#f9f9f9'
};

const oddRowStyle = {
  backgroundColor: 'white'
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#4285f4',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  margin: '10px',
  transition: 'background-color 0.3s',
  ':hover': {
    backgroundColor: '#3367d6'
  }
};

const adminButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#34a853',
  ':hover': {
    backgroundColor: '#2d8e47'
  }
};

export default ResultsPage;