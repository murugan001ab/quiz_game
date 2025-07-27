import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminContext, AdminProvider } from './AdminProvider';
import AdminLogin from './Admin';
import AdminCreatePage from './AdminCreate';
import QuestionManager from './QuestionManager';
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
  return isLogin ? children : <Navigate to="/admin" replace />;
};

// Public Only Route (for login/signup when already authenticated)
const PublicOnlyRoute = ({ children }) => {
  const { isLogin } = useContext(AdminContext);
  return !isLogin ? children : <Navigate to="/admin/dashboard" replace />;
};

function App() {
  return (
    <AdminProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<AdminPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/wait" element={<WaitForResult />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/readyquiz" element={<NameToReadyFlow />} />
          
          {/* Auth Routes (public only) */}
          <Route path="/admin" element={
            <PublicOnlyRoute>
              <AdminLogin />
            </PublicOnlyRoute>
          } />
          <Route path="/admin/create" element={
            <PublicOnlyRoute>
              <AdminCreatePage />
            </PublicOnlyRoute>
          } />
          <Route path="/forget" element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
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
            <ProtectedRoute>
              <QuizStartPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/nametoready" element={
            <ProtectedRoute>
              <NameGet />
            </ProtectedRoute>
          } />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminProvider>
  );
}

export default App;