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
    const ws = new WebSocket('ws://quizmastershub.duckdns.org/ws/result/');
    
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
      const response = await axios.get("http://quizmastershub.duckdns.org/users/");
      const sortedResults = [...response.data].sort((a, b) => b.score - a.score);
      setResults(sortedResults);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Medal colors for top 3 positions
  const getMedalColor = (rank) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#3b82f6'; // Default blue
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.waitingScreen}>
          <div style={styles.header}>
            <div style={styles.logo}>Quiz Game</div>
            <h1 style={styles.waitingTitle}>Results are on the way !</h1>
          </div>
          
          <div style={styles.animationContainer}>
              <div style={styles.loadingAnimation}>
            <div style={styles.loadingDot}></div>
            <div style={styles.loadingDot}></div>
            <div style={styles.loadingDot}></div>
          </div>
            {/* <div style={styles.podium}>
              <div style={styles.podiumFirst}></div>
              <div style={styles.podiumSecond}></div>
              <div style={styles.podiumThird}></div>
            </div> */}
            
            {/* <div style={styles.trophy}>
              <div style={styles.trophyBase}></div>
              <div style={styles.trophyStem}></div>
              <div style={styles.trophyTop}></div>
              <div style={styles.trophyGlow}></div>
            </div> */}
          </div>
          
          {/* <p style={styles.waitingMessage}>
            The quiz master is preparing to reveal the results...
          </p> */}
          
        
          
          {/* <div style={styles.statusCard}>
            <div style={styles.statusItem}>
              <div style={styles.statusLabel}>Status:</div>
              <div style={styles.statusValue}>
                Waiting for results
              </div>
            </div>
          </div> */}
        </div>
      ) : (
        <div style={styles.resultsScreen}>
          {/* <div style={styles.header}>
            <div style={styles.logo}>QuizMaster</div>
            <h1 style={styles.resultsTitle}>Quiz Results</h1>
          </div> */}
          
          <div style={styles.resultsContainer}>
            {results.length > 0 ? (
              <div style={styles.resultsTable}>
                {/* <div style={styles.tableHeader}>
                  <div style={styles.headerCell}>Rank</div>
                  <div style={styles.headerCell}>Participant</div>
                  <div style={styles.headerCell}>Score</div>
                </div> */}
                
                {results.map((participant, index) => (
                  <div 
                    key={participant.id} 
                    style={styles.tableRow(index === 0)}
                  >
                    <div style={styles.rankCell}>
                      {/* <div style={styles.rankBadge(index + 1)}>
                        {index + 1}
                      </div> */}
                    </div>
                    {/* <div style={styles.nameCell}>
                      {participant.name}
                    </div> */}
                    <div style={styles.scoreCell}>
                      {/* <div style={styles.scoreBadge}>
                        {participant.score} points
                      </div> */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.noResults}>
                {/* <div style={styles.noResultsIcon}>📊</div>
                <h3>No Results Available</h3>
                <p>Participants haven't completed the quiz yet</p> */}
              </div>
            )}
          </div>
          
          <div style={styles.actions}>
            {/* <button 
              onClick={() => navigate('/quiz')}
              style={styles.backButton}
            >
              Back to Quiz
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f5ff',
    backgroundImage: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '10px',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  waitingScreen: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    maxWidth: '600px',
    width: '100%',
  },
  waitingTitle: {
    fontSize: '2rem',
    color: '#3a0ca3',
    margin: '0 0 10px',
    fontWeight: '600',
  },
  waitingMessage: {
    fontSize: '1.2rem',
    color: '#64748b',
    margin: '0 0 30px',
  },
  animationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '200px',
    margin: '40px 0',
    position: 'relative',
  },
  podium: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '150px',
    zIndex: 2,
  },
  podiumFirst: {
    width: '80px',
    height: '120px',
    backgroundColor: '#FFD700',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    margin: '0 5px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  podiumSecond: {
    width: '80px',
    height: '90px',
    backgroundColor: '#C0C0C0',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    margin: '0 5px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  podiumThird: {
    width: '80px',
    height: '60px',
    backgroundColor: '#CD7F32',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    margin: '0 5px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  trophy: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
  },
  trophyBase: {
    width: '50px',
    height: '10px',
    backgroundColor: '#FFD700',
    borderRadius: '5px',
    margin: '0 auto',
  },
  trophyStem: {
    width: '10px',
    height: '50px',
    backgroundColor: '#FFD700',
    margin: '0 auto',
  },
  trophyTop: {
    width: '40px',
    height: '40px',
    backgroundColor: '#FFD700',
    borderRadius: '50%',
    margin: '0 auto',
    position: 'relative',
    top: '-10px',
  },
  trophyGlow: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    animation: 'pulse 2s infinite',
  },
  loadingAnimation: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '30px 0',
  },
  loadingDot: {
    width: '20px',
    height: '20px',
    backgroundColor: '#4361ee',
    borderRadius: '50%',
    animation: 'bounce 1.5s infinite',
  },
  statusCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: '15px',
    padding: '20px',
    marginTop: '20px',
  },
  statusItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: '1.1rem',
    color: '#64748b',
    fontWeight: '500',
  },
  statusValue: {
    fontSize: '1.1rem',
    color: '#3a0ca3',
    fontWeight: '600',
  },
  resultsScreen: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '800px',
  },
  resultsTitle: {
    fontSize: '2rem',
    color: '#3a0ca3',
    margin: '0 0 10px',
    fontWeight: '600',
  },
  resultsContainer: {
    margin: '30px 0',
  },
  resultsTable: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
  },
  tableHeader: {
    display: 'flex',
    backgroundColor: '#3a0ca3',
    color: 'white',
    fontWeight: '600',
  },
  headerCell: {
    flex: 1,
    padding: '15px 20px',
    textAlign: 'center',
  },
  tableRow: (isFirst) => ({
    display: 'flex',
    backgroundColor: isFirst ? '#f8fafc' : 'white',
    borderBottom: '1px solid #e2e8f0',
  }),
  rankCell: {
    flex: 1,
    padding: '15px 10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadge: (rank) => ({
    width: '40px',
    height: '40px',
    backgroundColor: getMedalColor(rank),
    color: rank <= 3 ? 'white' : '#1e293b',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  }),
  nameCell: {
    flex: 3,
    padding: '15px 20px',
    fontWeight: '500',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
  },
  scoreCell: {
    flex: 2,
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBadge: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    padding: '8px 20px',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '1rem',
  },
  noResults: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8fafc',
    borderRadius: '15px',
  },
  noResultsIcon: {
    fontSize: '4rem',
    color: '#cbd5e1',
    marginBottom: '20px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  backButton: {
    backgroundColor: '#4361ee',
    background: 'linear-gradient(135deg, #4361ee, #3a0ca3)',
    color: 'white',
    border: 'none',
    padding: '14px 40px',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 5px 15px rgba(67, 97, 238, 0.3)',
  },
  
  // Animations
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 0.7 },
    '50%': { transform: 'scale(1.1)', opacity: 0.4 },
    '100%': { transform: 'scale(1)', opacity: 0.7 },
  },
  '@keyframes bounce': {
    '50%, 100%': { transform: 'translateY(55)' },
    '50%': { transform: 'translateY(515px)' },
  },

  
  
  // Responsive styles
  '@media (max-width: 768px)': {
    waitingScreen: {
      padding: '30px 20px',
    },
    resultsScreen: {
      padding: '25px 15px',
    },
    animationContainer: {
      height: '150px',
    },
    podiumFirst: {
      width: '60px',
      height: '100px',
    },
    podiumSecond: {
      width: '60px',
      height: '70px',
    },
    podiumThird: {
      width: '60px',
      height: '50px',
    },
    trophyTop: {
      width: '30px',
      height: '30px',
    },
    tableHeader: {
      display: 'none',
    },
    tableRow: {
      flexDirection: 'column',
      padding: '15px',
      marginBottom: '15px',
      borderRadius: '10px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
    },
    rankCell: {
      justifyContent: 'flex-start',
      padding: '5px 0',
    },
    nameCell: {
      padding: '5px 0',
      fontSize: '1.2rem',
      fontWeight: '600',
    },
    scoreCell: {
      justifyContent: 'flex-start',
      padding: '5px 0',
    },
    headerCell: {
      padding: '12px 15px',
    },
  },
  '@media (max-width: 480px)': {
    logo: {
      fontSize: '2rem',
    },
    waitingTitle: {
      fontSize: '1.7rem',
    },
    resultsTitle: {
      fontSize: '1.7rem',
    },
    backButton: {
      width: '100%',
      padding: '14px',
    },
  },
};

export default WaitForResult;