import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';

const API_BASE = 'http://quizmastershub.duckdns.org/questions/';

const QuestionManager = () => {
  const { setQTime } = useContext(AdminContext);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [form, setForm] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    status: 'not answered',
    admin: null,
    description: "", // Fixed typo from discription
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get adminId from localStorage when component mounts
  useEffect(() => {
    const storedAdminId = localStorage.getItem('adminId');
    if (storedAdminId) {
      setAdminId(storedAdminId);
      setForm(prev => ({
        ...prev,
        admin: storedAdminId
      }));
    } else {
      alert('Admin not logged in');
    }
  }, []);

  // Fetch questions when adminId changes
  useEffect(() => {
    if (!adminId) return;
    
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE}${adminId}/`);
        setQuestions(response.data);
        setFilteredQuestions(response.data);
      } catch (err) {
        setError('Failed to load questions');
        console.error('Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [adminId]); // Add adminId as dependency






  useEffect(() => {
    const results = questions.filter(question =>
      question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.discription.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredQuestions(results);
  }, [searchTerm, questions]);

  const fetchQuestions = async () => {
    const res = await axios.get(`${API_BASE}${adminId}/`);
    setQuestions(res.data);
    setFilteredQuestions(res.data);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
    };

    try {
      if (editingId) {
        await axios.put(`${API_BASE}${editingId}/${adminId}/`, payload);
      } else {
        await axios.post(API_BASE, payload);
      }
      fetchQuestions();
      resetForm();
      setShowModal(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setForm({
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: '',
      status: 'not answered',
      admin: adminId,
      discription: ''
    });
    setEditingId(null);
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setForm({
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      status: q.status,
      admin: q.admin,
      discription: q.discription,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await axios.delete(`${API_BASE}${id}/${adminId}/`);
      fetchQuestions();
    }
  };

  return (
    <div className="question-manager-container">
      <div className="question-manager-header">
        <h2>Question Manager</h2>
        <div className="search-add-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="search-icon">🔍</i>
          </div>
          <button 
            className="add-question-btn"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Question
          </button>
        </div>
      </div>

      <div className="questions-grid">
        {filteredQuestions.map(q => (
          <div key={q.id} className="question-card">
            <h3>{q.question_text}</h3>
            <div className="question-details">
              <p><strong>Options:</strong> {q.options.join(', ')}</p>
              <p><strong>Answer:</strong> {q.correct_answer}</p>
              <p><strong>Status:</strong> <span className={`status-${q.status.replace(' ', '')}`}>{q.status}</span></p>
              {q.discription && <p><strong>Description:</strong> {q.discription}</p>}
            </div>
            <div className="question-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(q)}
              >
                Edit
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(q.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? 'Update Question' : 'Create New Question'}</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="question-form">
              <div className="form-group">
                <label>Question Text</label>
                <input
                  type="text"
                  name="question_text"
                  placeholder="Enter your question here"
                  value={form.question_text}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Options</label>
                {form.options.map((opt, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                ))}
              </div>

              <div className="form-group">
                <label>Correct Answer</label>
                <input
                  type="text"
                  name="correct_answer"
                  placeholder="Enter correct answer"
                  value={form.correct_answer}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select 
                  name="status" 
                  value={form.status} 
                  onChange={handleInputChange}
                >
                  <option value="not answered">Not Answered</option>
                  <option value="answered">Answered</option>
                  <option value="skipped">Skipped</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  name="discription" 
                  placeholder="Enter question description"
                  value={form.discription} 
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {editingId ? 'Update Question' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .question-manager-container {
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .question-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .question-manager-header h2 {
          color: #2c3e50;
          font-size: 28px;
          margin: 0;
        }

        .search-add-container {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          padding: 10px 15px 10px 35px;
          border: 1px solid #dfe6e9;
          border-radius: 8px;
          font-size: 14px;
          width: 250px;
          transition: all 0.3s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          color: #7f8c8d;
        }

        .add-question-btn {
          background: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .add-question-btn:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }

        .questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .question-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: all 0.3s;
        }

        .question-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .question-card h3 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 15px;
          font-size: 18px;
        }

        .question-details {
          color: #7f8c8d;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .question-details p {
          margin: 5px 0;
        }

        .status-notanswered {
          color: #e74c3c;
        }

        .status-answered {
          color: #2ecc71;
        }

        .status-skipped {
          color: #f39c12;
        }

        .question-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }

        .edit-btn, .delete-btn {
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          flex: 1;
        }

        .edit-btn {
          background: #f39c12;
          color: white;
        }

        .edit-btn:hover {
          background: #e67e22;
        }

        .delete-btn {
          background: #e74c3c;
          color: white;
        }

        .delete-btn:hover {
          background: #c0392b;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 10px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
          margin: 0;
          color: #2c3e50;
        }

        .close-modal {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #7f8c8d;
          transition: color 0.3s;
        }

        .close-modal:hover {
          color: #e74c3c;
        }

        .question-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #2c3e50;
          font-weight: 600;
          font-size: 14px;
        }

        .form-group input, 
        .form-group select, 
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #dfe6e9;
          border-radius: 5px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .cancel-btn, .submit-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .cancel-btn {
          background: #95a5a6;
          color: white;
        }

        .cancel-btn:hover {
          background: #7f8c8d;
        }

        .submit-btn {
          background: #2ecc71;
          color: white;
        }

        .submit-btn:hover {
          background: #27ae60;
        }

        /* Responsive Styles */
        @media (max-width: 768px) {
          .question-manager-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .search-add-container {
            width: 100%;
            flex-direction: column;
            align-items: flex-start;
          }

          .search-box input {
            width: 100%;
          }

          .add-question-btn {
            width: 100%;
            justify-content: center;
          }

          .questions-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            width: 95%;
          }
        }

        @media (max-width: 480px) {
          .question-manager-container {
            padding: 15px;
          }

          .form-actions {
            flex-direction: column;
          }

          .cancel-btn, .submit-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default QuestionManager;