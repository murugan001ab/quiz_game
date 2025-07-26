import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX } from 'react-icons/fi';

const API_BASE = 'http://localhost:8000/questions/';

const QuestionManager = () => {
  const { adminId, setQTime } = useContext(AdminContext);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    status: 'not answered',
    admin: adminId,
    discription: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await axios.get(API_BASE);
    setQuestions(res.data);
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
    const payload = { ...form };

    console.log("Submitting question:", payload);

    try {
      if (editingId) {
        await axios.put(`${API_BASE}${editingId}/${adminId}/`, payload);
      } else {
        await axios.post(API_BASE, payload);
      }
      fetchQuestions();
      resetForm();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const resetForm = () => {
    setForm({
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: '',
    
      admin: adminId,
      discription: ''
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setForm({
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      admin: q.admin,
      discription: q.discription,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await axios.delete(`${API_BASE}${id}/${adminId}/`);
      fetchQuestions();
    }
  };

  return (
    <div className="question-manager">
      <div className="header-section">
        <h1>Question Management</h1>
        <button 
          className="toggle-form-btn"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? <><FiX /> Close Form</> : <><FiPlus /> Add Question</>}
        </button>
      </div>

      {isFormOpen && (
        <div className="question-form-container">
          <h2>{editingId ? 'Update Question' : 'Create New Question'}</h2>
          <form onSubmit={handleSubmit} className="question-form">
            <div className="form-group">
              <label>Question Text</label>
              <input
                type="text"
                name="question_text"
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
                value={form.correct_answer}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="discription" 
                value={form.discription} 
                onChange={handleInputChange}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingId ? <><FiSave /> Update</> : <><FiSave /> Create</>}
              </button>
              <button type="button" onClick={resetForm} className="cancel-btn">
                <FiX /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="questions-list">
        <h2>All Questions ({questions.length})</h2>
        <div className="questions-grid">
          {questions.map(q => (
            <div key={q.id} className="question-card">
              <div className="question-content">
                <h3>{q.question_text}</h3>
                <div className="options-list">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`option ${opt === q.correct_answer ? 'correct' : ''}`}>
                      {opt}
                    </div>
                  ))}
                </div>
                <p className="description">{q.discription}</p>
              </div>
              <div className="question-actions">
                <button onClick={() => handleEdit(q)} className="edit-btn">
                  <FiEdit2 /> Edit
                </button>
                <button onClick={() => handleDelete(q.id)} className="delete-btn">
                  <FiTrash2 /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .question-manager {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .header-section h1 {
    color: #2c3e50;
    margin: 0;
  }

  .toggle-form-btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .toggle-form-btn:hover {
    background: #2980b9;
  }

  .question-form-container {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  }

  .question-form-container h2 {
    color: #2c3e50;
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  .question-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group label {
    font-weight: 500;
    color: #34495e;
    font-size: 0.95rem;
  }

  .form-group input, .form-group textarea {
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .form-group input:focus, .form-group textarea:focus {
    border-color: #3498db;
    outline: none;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .submit-btn {
    background: #2ecc71;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .submit-btn:hover {
    background: #27ae60;
  }

  .cancel-btn {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .cancel-btn:hover {
    background: #c0392b;
  }

  .questions-list h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
  }

  .questions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .question-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
    border-left: 4px solid #3498db;
  }

  .question-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .question-content h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #2c3e50;
  }

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .option {
    padding: 0.6rem 1rem;
    background: #f8f9fa;
    border-radius: 4px;
    border-left: 3px solid #95a5a6;
  }

  .option.correct {
    background: #e8f8f5;
    border-left-color: #2ecc71;
    font-weight: 500;
  }

  .description {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .question-actions {
    display: flex;
    gap: 0.8rem;
  }

  .edit-btn {
    background: #3498db;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .edit-btn:hover {
    background: #2980b9;
  }

  .delete-btn {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .delete-btn:hover {
    background: #c0392b;
  }

  @media (max-width: 768px) {
    .header-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .questions-grid {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column;
    }
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default QuestionManager;