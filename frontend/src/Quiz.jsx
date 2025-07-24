import { useEffect, useState,useContext } from 'react'
import './App.css'
import { fetchQuestions, GetResult, saveUserScore } from "./api";



function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [show, setShow] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timer, setTimer] = useState(15);
  const [score, setScore] = useState(0);

  const [skip, setSkip] = useState([]);
  const [name, setName] = useState("");
  const [start, setStart] = useState(true);

  const [timeLeft, setTimeLeft] = useState(150); // Total quiz time
  const [results, setResults] = useState([]);
  const [showAllResults, setShowAllResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeUp, setTimeUp] = useState(false); // to track if time has expired

  // Fetch questions once
  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await fetchQuestions();
        if (data) {
          setQuestions(data);
      
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }
    loadQuestions();
  }, []);

  // Total quiz timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      setLoading(true)
      return () => clearInterval(timerId);
    }

    if (timeLeft === 0) {
      // saveUserScore(name, score)
      // .then(() => console.log("Score saved"))
      // .catch(err => console.error("Error saving score", err));
    setShow(true);
      setTimeUp(true); 
      setLoading(false)// mark that quiz time is up
    }
  }, [timeLeft]);

  // Per-question timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(second => second - 1);
      }, 1000);
    } else if (timer === 0) {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimer(15);
      } else {
        clearInterval(interval);
        setShow(true);
      }
    }

    return () => clearInterval(interval);
  }, [timer, currentQuestion]);

  const handleSkip = () => {
    setSkip([...skip, currentQuestion]);
    if (currentQuestion < questions.length-1) {
      setCurrentQuestion(prev => prev + 1);
      setTimer(15);
    }
    else if (currentQuestion === questions.length - 1) {
      saveUserScore(name, score)
        .then(() => console.log("Score saved"))
        .catch(err => console.error("Error saving score", err));
      setShow(true);
    }
  };

  const handleQuestion = (option) => {
    if (option === questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestion === questions.length - 1) {
      saveUserScore(name, score)
        .then(() => console.log("Score saved"))
        .catch(err => console.error("Error saving score", err));
      setShow(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setTimer(15);
    }
  };

  const handleResult = async () => {
    if (!timeUp) return; // prevent results before time is up

    setLoading(true);
    try {
      const res = await GetResult();
      setResults(res.data);
      setShowAllResults(true);
    } catch (error) {
      console.error("Failed to fetch results", error);
    }
    setLoading(false);
  };

  const handleReset = (e) => {

    
    setCurrentQuestion(0);
    setTimer(15);
    setScore(0);
    setShow(false);
    setSkip([]);
    setTimeLeft(150);
    setTimeUp(false);
    setShowAllResults(false);
    setLoading(false);
    
  };

  return (
    <>
      {start ? (
        <div className="enter">
          <label htmlFor="name">Enter name</label>
          <input type="text" onChange={(e) => setName(e.target.value)} placeholder="Enter name" required />
          <button className="start" onClick={() => {
            setStart(false);
            handleReset();
          }}>Start</button>
        </div>
      ) : (
        <>
          {showAllResults ? (
            <div className="results">
            <h2>📊 Final Results</h2>
            <ul className="score-list">
  {results
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((res, index) => (
      <li key={index} className="score-card">
        <img
          src={
            index === 0
              ? "/medal.png"
              : index === 1
              ? "/medal(1).png"
              : "/medal(2).png"
          }
          alt="Medal"
          className="medal"
        />
        <div className="score-info">
          <strong className="username">{res.name.toUpperCase()}</strong>
          <span className="points">{res.score} pts</span>
        </div>
      </li>
    ))}
</ul>
            {/* <button onClick={handleReset} className="restart">Restart</button> */}
          </div>
          
          ) : show ? (
            <div className="score">
              <p className='s'>Your score is {score}/{questions.length}</p>

              {!timeUp && <p className="info">
                ⏳ Please wait until others finish <span className='t'>{timeLeft}</span>s</p>}

              <button
                onClick={handleResult}
                className="restart"
                disabled={!timeUp || loading}
              >
                {loading ? "Loading..." : "See All Results"}
              </button>
            </div>
          ) : (
            <div className="quiz">
              <div className="question">
                <div className="q">
                  <p className='qn'>Question {questions[currentQuestion].id}</p>
                  <h3 className='qq'>{questions[currentQuestion].question_text}</h3>
                </div>
                <div className="option">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button key={index} onClick={() => handleQuestion(option)}>{option}</button>
                  ))}
                </div>
                <p>⏳ Current Question Time: <span className='t'>{timer}</span>s</p>
                {/* <p>🕔 Total Quiz Time Left: {timeLeft}s</p> */}
                <button className="skip" onClick={handleSkip}>Skip</button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Quiz;
