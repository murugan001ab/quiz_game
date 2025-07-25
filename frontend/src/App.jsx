import { useEffect, useState } from 'react'
// import './App.css'
import AdminLogin from './Admin';
import AdminCreatePage from './AdminCreate';
import QuestionManager from './QuestionManager';
// import { fetchQuestions, GetResult, saveUserScore } from "./api";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AdminProvider } from './AdminProvider';
import Quiz from './Newquiz';
import QuizPage from './userquiz';
import ResetPassword from './Forget';
import AdminPage from './AdminPage';
import AdminDashboard from './AdminDashboard';
import NewQuiz from './Newquiz';
import QuizStartPage from './StartQuiz';





function App() {

  
  
  return (
  <AdminProvider>
  <Router>
  <Routes>
   
  <Route path="/" element={<AdminPage />} /> 
  <Route path="/temp" element={<Quiz />} />
  <Route path="/admin" element={<AdminLogin />} />
  <Route path="/admin/create" element={<AdminCreatePage />} />
  <Route path="/admin/questions" element={<QuestionManager />} /> 
  <Route path="/quiz" element={<QuizPage />} />  
  <Route path='/forget' element={<ResetPassword/>}/>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
  <Route path='/admin/new-quiz' element={<NewQuiz />} />
  <Route path="/admin/start-quiz" element={<QuizStartPage />} />

  </Routes>
  </Router>
  </AdminProvider> 
  );
}

export default App;
