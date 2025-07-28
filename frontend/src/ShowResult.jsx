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
  const { BASE_URL} = useContext(AdminContext);


  const adminId = localStorage.getItem('adminId') || null;

  // Initialize WebSocket connection
  useEffect(() => {
    const ws = new WebSocket(`ws://${BASE_URL}/ws/result/`);
    
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
      const response = await axios.get(`http://${BASE_URL}/users/?admin_id=${adminId}`);
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
        adminId: adminId
      }));
      console.log("Show results command sent to all clients for admin:", adminId);
    }
  };

  const goToAdminPanel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-header">
          <h1>Quiz Results</h1>
          <br />
          {/* <div className="admin-badge">Admin ID: {adminId}</div> */}
        </div>
        
        {!showResults ? (
          <div className="action-section">
            <button 
              onClick={showResultsToAll} 
              disabled={loading}
              className={`primary-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                'Show Results To Everyone'
              )}
            </button>
          </div>
        ) : (
          <div className="results-content">
            {results.length > 0 ? (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((p, i) => (
                      <tr key={i} className={i < 3 ? `top-${i+1}` : ''}>
                        <td>
                          {i < 3 ? (
                            <span className="medal">{['🥇', '🥈', '🥉'][i]}</span>
                          ) : (
                            i + 1
                          )}
                        </td>
                        <td>{p.name}</td>
                        <td>{p.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-results">
                <p>No results available yet</p>
              </div>
            )}
            
            <button onClick={goToAdminPanel} className="secondary-btn">
              Go to Admin Panel
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .results-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        
        .results-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 40px;
          width: 100%;
          max-width: 800px;
        }
        
        .results-header {
          text-align: center;
          margin-bottom: 30px;
          position: relative;
        }
        
        .results-header h1 {
          color: #2c3e50;
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        
        .admin-badge {
          display: inline-block;
          background: #3498db;
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .action-section {
          text-align: center;
          margin: 30px 0;
        }
        
        .primary-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        
        .primary-btn:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(41, 128, 185, 0.3);
        }
        
        .primary-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }
        
        .primary-btn.loading {
          background: #3498db;
        }
        
        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .results-content {
          margin-top: 20px;
        }
        
        .results-table-container {
          overflow-x: auto;
          margin: 30px 0;
        }
        
        .results-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .results-table th {
          background: #3498db;
          color: white;
          padding: 15px;
          text-align: left;
        }
        
        .results-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        
        .results-table tr:last-child td {
          border-bottom: none;
        }
        
        .results-table tr:hover {
          background-color: #f8f9fa;
        }
        
        .top-1 {
          background-color: #fff8e1;
        }
        
        .top-2 {
          background-color: #f5f5f5;
        }
        
        .top-3 {
          background-color: #fffde7;
        }
        
        .medal {
          font-size: 20px;
          margin-right: 5px;
        }
        
        .no-results {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
          font-size: 18px;
        }
        
        .secondary-btn {
          background: #2ecc71;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: block;
          width: 100%;
          max-width: 200px;
          margin: 30px auto 0;
        }
        
        .secondary-btn:hover {
          background: #27ae60;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .results-card {
            padding: 30px 20px;
          }
          
          .results-header h1 {
            font-size: 24px;
          }
          
          .results-table th, 
          .results-table td {
            padding: 10px 12px;
            font-size: 14px;
          }
        }
        
        @media (max-width: 480px) {
          .results-container {
            padding: 15px;
          }
          
          .results-card {
            padding: 25px 15px;
          }
          
          .results-header h1 {
            font-size: 22px;
          }
          
          .primary-btn, 
          .secondary-btn {
            padding: 10px 20px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsPage;