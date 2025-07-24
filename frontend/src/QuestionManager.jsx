import React, { useState, useEffect,useContext } from 'react';
import axios from 'axios';
import { AdminContext } from './AdminProvider';

const API_BASE = 'http://localhost:8000/questions/';


const QuestionManager = () => {

  const { adminId,setQTime } = useContext(AdminContext);
  const [questions, setQuestions] = useState([]);
  // const [inputVisible, setInputVisible] = useState(true);
  // const [seconds, setSeconds] = useState(10); // default 10 sec

  const [form, setForm] = useState({
    question_text: '',
    options: ['', '', '', ''],
    correct_answer: '',
    status: 'not answered',
    admin: adminId,
    discription:"",
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

    // setQTime(seconds);


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
        discription:''
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
      discription:q.discription,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await axios.delete(`${API_BASE}${id}/${adminId}/`);
      fetchQuestions();
    }
  };
  
  // useEffect(() => {
  //   if (seconds >= 10 && seconds <= 60) {
  //     const timer = setTimeout(() => {
  //       setInputVisible(false);
  //     }, seconds * 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [seconds]);


  return (
    <div style={{ padding: 20 }}>
      <h2>{editingId ? 'Update Question' : 'Create New Question'}</h2>
      <form onSubmit={handleSubmit}>
        {/* <label>Set timeout in seconds (10–60): </label>
      <input
        type="number"
        min={10}
        max={60}
        value={seconds}
        onChange={(e) => setSeconds(Number(e.target.value))}
      /> */}
       
        <input
          type="text"
          name="question_text"
          placeholder="Question Text"
          value={form.question_text}
          onChange={handleInputChange}
          required
        /><br />

        <h4>Options:</h4>
        {form.options.map((opt, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            required
          />
        ))}<br />

        <input
          type="text"
          name="correct_answer"
          placeholder="Correct Answer"
          value={form.correct_answer}
          onChange={handleInputChange}
          required
        /><br />

        <select name="status" value={form.status} onChange={handleInputChange}>
          <option value="not answered">Not Answered</option>
          <option value="answered">Answered</option>
          <option value="skipped">Skipped</option>
        </select><br />
        <h2>discription</h2>
        <textarea name="discription" id="" value={form.discription} onChange={handleInputChange}></textarea>

        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>

      <h2>All Questions</h2>
      <ul>
        {questions.map(q => (
          <li key={q.id}>
            <b>{q.question_text}</b><br />
            Options: {q.options.map((opt, i) => <span key={i}>{opt}{i < q.options.length - 1 ? ', ' : ''}</span>)}<br />
            Answer: {q.correct_answer}<br />
            Status: {q.status}<br />
            Discription:{q.discription}<br/>
            <button onClick={() => handleEdit(q)}>Edit</button>
            <button onClick={() => handleDelete(q.id)}>Delete</button>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionManager;
