// LogoutButton.js
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from './AdminProvider';

const LogoutButton = () => {
  const { logout } = useContext(AdminContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin'); // Redirect to login page
  };

  return (
    <button 
      onClick={handleLogout}
      className="logout-button"
    >
      Logout
    </button>
  );
};

export default LogoutButton;