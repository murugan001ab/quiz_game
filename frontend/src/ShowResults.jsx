import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Dummy data to show immediately when button is clicked
  const dummyResults = [
    { name: "Loading...", score: 0 },
    { name: "Loading...", score: 0 },
    { name: "Loading...", score: 0 },
    { name: "Loading...", score: 0 },
    { name: "Loading...", score: 0 }
  ];

  const fetchResults = async () => {
    setShowResults(true); // Show results immediately with dummy data
    setResults(dummyResults); // Set dummy data first
    setLoading(true);
    
    try {
      const response = await axios.get("http://127.0.0.1:8000/results/");
      // Sort results by score in descending order
      const sortedResults = response.data.top_participants?.sort((a, b) => b.score - a.score) || [];
      setResults(sortedResults);
    } catch (error) {
      console.error("Error fetching results:", error);
      // Keep the dummy data visible but show error status
      setResults([...dummyResults, { name: "Error loading results", score: "N/A" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Quiz Results</h1>
      
      {!showResults ? (
        <div style={styles.buttonContainer}>
          <button 
            style={styles.showResultsButton}
            onClick={fetchResults}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Show Results'}
          </button>
        </div>
      ) : (
        <div style={styles.resultsContainer}>
          <div style={styles.resultsHeader}>
            <h2 style={styles.leaderboardTitle}>Leaderboard</h2>
            <button 
              style={styles.backButton}
              onClick={handleBackToQuiz}
            >
              Back to Quiz
            </button>
          </div>
          
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader}>Rank</th>
                  <th style={styles.tableHeader}>Player Name</th>
                  <th style={styles.tableHeader}>Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((player, index) => (
                  <tr 
                    key={index} 
                    style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                  >
                    <td style={styles.tableCell}>{index + 1}</td>
                    <td style={styles.tableCell}>{player.name}</td>
                    <td style={styles.tableCell}>{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loading && (
              <div style={styles.loadingMessage}>
                Loading real results...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#4a6bff',
    marginBottom: '2rem',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '3rem',
  },
  showResultsButton: {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    backgroundColor: '#4a6bff',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    fontWeight: 'bold',
  },
  showResultsButtonHover: {
    backgroundColor: '#3a5bef',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '2rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  leaderboardTitle: {
    color: '#4a6bff',
    fontSize: '1.8rem',
    margin: 0,
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  tableHeaderRow: {
    backgroundColor: '#4a6bff',
    color: 'white',
  },
  tableHeader: {
    padding: '1rem',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  tableRowEven: {
    backgroundColor: '#f8f9fa',
  },
  tableRowOdd: {
    backgroundColor: 'white',
  },
  tableCell: {
    padding: '1rem',
    borderBottom: '1px solid #e0e0e0',
  },
};

export default ResultsPage;