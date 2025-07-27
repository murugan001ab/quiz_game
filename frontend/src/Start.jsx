import { useNavigate } from 'react-router-dom';



function Start() {
  const navigate = useNavigate();



  const handleStart = () => {
    navigate('/game'); // Navigate to /game route
  };

  return (
    <div>

        <QRCodeGenerator/>
      <h1>Welcome to the Game</h1>


      <button onClick={handleStart}>Start Game</button>
    </div>
  );
}

export default Start;
