import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "./AdminProvider";

function NameGet() {
  const navigate = useNavigate();
  const { aname, setName } = useContext(AdminContext);

  const handleNext = () => {
    if (aname.trim() && aname.length >= 3) {
      navigate("/readyquiz");
      setName(aname);
    }
    else if(aname.length < 3) {
      alert("Please enter a name with at least 3 characters.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome to QuizMaster!</h2>
          <p style={styles.subtitle}>Enter your name to begin the quiz</p>
        </div>
        
        <div style={styles.inputContainer}>
          <input
            type="text"
            value={aname}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            minLength={3}
            required
            style={styles.input}
          />
          <div style={styles.icon}>👤</div>
        </div>
        
        <button
          onClick={handleNext}
          disabled={!aname.trim()}
          style={styles.button(!aname.trim())}
        >
          Start
          <div style={styles.arrow}>→</div>
        </button>
        
        <div style={styles.footer}>
          <p style={styles.tip}>Tip: Use your real name to appear on the leaderboard!</p>
        </div>
      </div>
      
      <div style={styles.decoration}>
        <div style={styles.circle1}></div>
        <div style={styles.circle2}></div>
        <div style={styles.circle3}></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f5ff',
    backgroundImage: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    maxWidth: '450px',
    width: '100%',
    zIndex: 10,
    position: 'relative',
  },
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '1.8rem',
    color: '#1e293b',
    margin: '0 0 10px',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    margin: '0',
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '30px',
  },
  input: {
    width: '100%',
    padding: '16px 20px 16px 50px',
    fontSize: '1.1rem',
    borderRadius: '12px',
    border: '2px solid #e2e8f0',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: '#4361ee',
    boxShadow: '0 0 0 4px rgba(67, 97, 238, 0.2)',
  },
  icon: {
    position: 'absolute',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.5rem',
    color: '#64748b',
  },
  button: (disabled) => ({
    backgroundColor: disabled ? '#cbd5e1' : '#4361ee',
    background: disabled ? '#cbd5e1' : 'linear-gradient(135deg, #4361ee, #3a0ca3)',
    color: 'white',
    border: 'none',
    padding: '16px 30px',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: disabled ? 'none' : '0 8px 20px rgba(67, 97, 238, 0.4)',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
  }),
  arrow: {
    fontSize: '1.4rem',
    transition: 'transform 0.3s ease',
  },
  footer: {
    marginTop: '30px',
  },
  tip: {
    color: '#94a3b8',
    fontSize: '0.95rem',
    margin: '0',
    fontStyle: 'italic',
  },
  decoration: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    top: '-100px',
    right: '-100px',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle2: {
    position: 'absolute',
    bottom: '-150px',
    left: '-150px',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle3: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  // Responsive styles
  '@media (max-width: 600px)': {
    card: {
      padding: '30px 20px',
    },
    title: {
      fontSize: '1.5rem',
    },
    subtitle: {
      fontSize: '1rem',
    },
    input: {
      padding: '14px 20px 14px 45px',
      fontSize: '1rem',
    },
    button: {
      padding: '14px 20px',
      fontSize: '1rem',
    },
  },
  '@media (max-width: 400px)': {
    title: {
      fontSize: '1.3rem',
    },
    input: {
      padding: '12px 15px 12px 40px',
    },
    icon: {
      left: '15px',
      fontSize: '1.3rem',
    },
  },
};

export default NameGet;