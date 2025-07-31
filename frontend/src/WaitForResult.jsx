import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminContext } from './AdminProvider';

const WaitForResult = () => {
  const { BASE_URL,BASE } = useContext(AdminContext);
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const [adminId,setAdminId]=useState(localStorage.getItem("adminId") || null )
  const startgame=localStorage.getItem('startgame')

  useEffect(() => {
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    
    const connectWebSocket = () => {
      const ws = new WebSocket(`ws://${BASE_URL}/ws/result/`);
      
      ws.onopen = () => {
        reconnectAttempts = 0;
        socketRef.current = ws;
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if ((data.type === 'results_control' && data.show ) )
          // || (startgame=='true')
        {
          fetchResults();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (e) => {
        if (reconnectAttempts < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts++;
            connectWebSocket();
          }, 1000 * reconnectAttempts);
        }
      };
    };

    connectWebSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${BASE_URL}/users/?admin_id=${adminId}`);
      const sortedResults = [...response.data].sort((a, b) => b.score - a.score);
      setResults(sortedResults);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalColor = (rank) => {
    switch(rank) {
      case 1: return 'linear-gradient(135deg, #FFD700, #FFC000)';
      case 2: return 'linear-gradient(135deg, #C0C0C0, #A0A0A0)';
      case 3: return 'linear-gradient(135deg, #CD7F32, #B56C28)';
      default: return 'linear-gradient(135deg, #F1F5F9, #E2E8F0)';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      padding: '10px',
      fontFamily: "'Inter', sans-serif",
    },
    loadingCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      padding: '40px',
      textAlign: 'center',
      maxWidth: '500px',
      width: '100%',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transform: 'translateY(0)',
      transition: 'transform 0.3s ease',
    },
    resultsCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      padding: '32px',
      width: '100%',
      maxWidth: '800px',
      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      transform: 'translateY(0)',
      transition: 'transform 0.3s ease',
    },
    title: {
      background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontSize: '2.5rem',
      fontWeight: '800',
      marginBottom: '16px',
    },
    subtitle: {
      color: '#64748B',
      fontSize: '1.1rem',
      marginBottom: '32px',
    },
    loadingDots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      margin: '40px 0',
    },
    dot: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
      boxShadow: '0 0 15px rgba(79, 70, 229, 0.5)',
      animation: 'bounce 1.5s infinite ease-in-out',
    },
    table: {
      width: '100%',
      borderRadius: '16px',
      overflow: 'hidden',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
      color: 'white',
      textAlign: 'left',
    },
    tableHeaderCell: {
      padding: '10px 20px',
      fontWeight: '600',
      fontSize: '1.1rem',
    },
    tableRow: {
      borderBottom: '1px solid #E2E8F0',
      transition: 'all 0.3s ease',
    },
    tableCell: {
      padding: '10px 20px',
      fontWeight: '500',
      color: '#1E293B',
    },
    rankBadge: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '1.2rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      margin: '0 auto',
    },
    scoreBadge: {
      background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
      color: '#0369A1',
      padding: '8px 10px',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '0.9rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      display: 'inline-block',
    },
    noResults: {
      textAlign: 'center',
      padding: '40px',
      background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)',
      borderRadius: '16px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    },
    noResultsIcon: {
      fontSize: '4rem',
      color: '#94A3B8',
      marginBottom: '20px',
      animation: 'pulse 2s infinite',
    },
    divider: {
      height: '3px',
      width: '80px',
      background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
      margin: '16px auto',
      borderRadius: '3px',
    },
    button: {
      background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '30px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
      transition: 'all 0.3s ease',
      marginTop: '24px',
    },
  };

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loadingCard}>
          <div>
            <h1 style={styles.title}>Calculating Results</h1>
            <p style={styles.subtitle}>Finalizing the scores...</p>
          </div>
          
          <div style={styles.loadingDots}>
            {[0, 0.2, 0.4].map((delay) => (
              <div 
                key={delay}
                style={{
                  ...styles.dot,
                  animationDelay: `${delay}s`
                }}
              />
            ))}
          </div>
          <p style={{ color: '#4F46E5', opacity: 0.7, fontSize: '0.9rem', marginTop: '16px' }}>
            This won't take long...
          </p>
        </div>
      ) : (
        <div style={styles.resultsCard}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={styles.title}>Quiz Results</h1>
            <div style={styles.divider}></div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            {results.length > 0 ? (
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Rank</th>
                    <th style={styles.tableHeaderCell}>Participant</th>
                    <th style={{ ...styles.tableHeaderCell, textAlign: 'center' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((participant, index) => (
                    <tr 
                      key={participant.id || index}
                      style={{
                        ...styles.tableRow,
                        backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.9)' : 'rgba(248, 250, 252, 0.9)',
                      }}
                    >
                      <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                        <div 
                          style={{
                            ...styles.rankBadge,
                            background: getMedalColor(index + 1),
                            color: index < 3 ? 'white' : '#1E293B',
                          }}
                        >
                          {index + 1}
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <div style={{ display: 'flex', alignItems: 'center' ,fontWeight: '600'}}>
                          {/* <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            marginRight: '12px',
                            background: index < 3 ? 'linear-gradient(90deg, #4F46E5, #7C3AED)' : '#A5B4FC',
                          }}></div> */}
                          {participant.name.toUpperCase() || `Participant ${index + 1}`}
                        </div>
                      </td>
                      <td style={{ ...styles.tableCell, textAlign: 'center' }}>
                        <span style={styles.scoreBadge}>
                          {participant.score} points
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.noResults}>
                <div style={styles.noResultsIcon}>📊</div>
                <h3 style={{ color: '#1E293B', fontSize: '1.5rem', marginBottom: '8px' }}>No Results Yet</h3>
                <p style={{ color: '#64748B', marginBottom: '16px' }}>Waiting for participants to complete the quiz</p>
                <button 
                  style={styles.button}
                  onClick={fetchResults}
                >
                  Refresh Results
                </button>
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
              <button 
                style={{
                  ...styles.button,
                  padding: '12px 32px',
                }}
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}
      </style>
    </div>
  );
};

export default WaitForResult;
