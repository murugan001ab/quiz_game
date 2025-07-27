import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';

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
      setForm({
        question_text: '',
        options: ['', '', '', ''],
        correct_answer: '',
        status: 'not answered',
        admin: adminId,
        discription: ''
      });
      setEditingId(null);
    } catch (err) {
      alert('Error: ' + err.message);
    }
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await axios.delete(`${API_BASE}${id}/${adminId}/`);
      fetchQuestions();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>{editingId ? 'Update Question' : 'Create New Question'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Question Text:</label>
            <input
              type="text"
              name="question_text"
              placeholder="Enter your question here"
              value={form.question_text}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Options:</label>
            {form.options.map((opt, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                style={styles.input}
              />
            ))}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Correct Answer:</label>
            <input
              type="text"
              name="correct_answer"
              placeholder="Enter correct answer"
              value={form.correct_answer}
              onChange={handleInputChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Status:</label>
            <select 
              name="status" 
              value={form.status} 
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="not answered">Not Answered</option>
              <option value="answered">Answered</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea 
              name="discription" 
              placeholder="Enter question description"
              value={form.discription} 
              onChange={handleInputChange}
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.submitButton}>
            {editingId ? 'Update Question' : 'Create Question'}
          </button>
        </form>
      </div>

      <div style={styles.questionsContainer}>
        <h2 style={styles.heading}>All Questions</h2>
        <div style={styles.questionsList}>
          {questions.map(q => (
            <div key={q.id} style={styles.questionCard}>
              <h3 style={styles.questionText}>{q.question_text}</h3>
              <p style={styles.questionDetail}><strong>Options:</strong> {q.options.join(', ')}</p>
              <p style={styles.questionDetail}><strong>Answer:</strong> {q.correct_answer}</p>
              <p style={styles.questionDetail}><strong>Status:</strong> {q.status}</p>
              <p style={styles.questionDetail}><strong>Description:</strong> {q.discription}</p>
              <div style={styles.buttonGroup}>
                <button 
                  onClick={() => handleEdit(q)} 
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(q.id)} 
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px'
  },
  questionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '25px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  heading: {
    color: '#2c3e50',
    marginBottom: '20px',
    fontSize: '24px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    color: '#34495e',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    transition: 'border 0.3s',
    outline: 'none',
    ':focus': {
      border: '1px solid #3498db'
    }
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical'
  },
  submitButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  questionsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  questionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  questionText: {
    color: '#2c3e50',
    marginBottom: '10px',
    fontSize: '18px'
  },
  questionDetail: {
    color: '#7f8c8d',
    margin: '5px 0',
    fontSize: '14px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  editButton: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#e67e22'
    }
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '8px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#c0392b'
    }
  }
};

export default QuestionManager;