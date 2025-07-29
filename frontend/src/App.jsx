import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminContext, AdminProvider } from './AdminProvider';
import AdminLogin from './Admin';
import AdminCreatePage from './AdminCreate';
import QuestionManager from './QuestionManager';
import Quiz from './Newquiz';
import QuizPage from './userquiz';
import ResetPassword from './Forget';
import AdminPage from './AdminPage';
import AdminDashboard from './AdminDashboard';
import NewQuiz from './Newquiz';
import QuizStartPage from './StartQuiz';
import NameToReadyFlow from './NametoReadyFlow';
import NameGet from './NameGet';
import ResultsPage from './ShowResult';
import WaitForResult from './WaitForResult';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isLogin } = useContext(AdminContext);
  const storedAdminId = localStorage.getItem('adminId');
  const storedExpiry = localStorage.getItem('adminSessionExpiry');

  // Check if session is valid
  const isAuthenticated = () => {
    return (isLogin || (storedAdminId && storedExpiry && new Date().getTime() < parseInt(storedExpiry)));
  };

  if (!isAuthenticated()) {
    // Clear invalid session if exists
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminSessionExpiry');
    return <Navigate to="/admin" replace />;
  }

  return children;
};

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AdminPage />} />
          <Route path="/temp" element={<Quiz />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/create" element={<AdminCreatePage />} />
          <Route path="/forget" element={<ResetPassword />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/readyquiz" element={<NameToReadyFlow />} />
          <Route path="/wait" element={<WaitForResult />} />
           <Route path="/admin/nametoready" element={<NameGet /> } />
           <Route path="/results" element={
    
              <ResultsPage />
            
          } />

          {/* Protected Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/questions" element={
            <ProtectedRoute>
              <QuestionManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/new-quiz" element={
            <ProtectedRoute>
              <NewQuiz />
            </ProtectedRoute>
          } />
          <Route path="/admin/start-quiz" element={
         
              <QuizStartPage />
           
          } />
         
          
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;
