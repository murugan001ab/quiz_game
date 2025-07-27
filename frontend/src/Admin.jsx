  import React, { useState,useContext } from 'react';
  import axios from 'axios';
  import { AdminContext } from './AdminProvider';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

  const AdminLogin = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();


      const { setAdminId } = useContext(AdminContext);

    const handleLogin = async (e) => {
      e.preventDefault();

      try {
        const res = await axios.post('http://localhost:8000/api/admin/login/', {
          name,
          password,
        });
        
        if (res.data.message=="Login successful") {
          setMessage('Login successful!');
          // You can store token in localStorage or redirect to dashboard
          // localStorage.setItem('token', res.data.token);
          setAdminId(res.data.admin_id)

          console.log(res.data.admin_id)

          navigate('/admin/dashboard'); // Redirect to admin dashboard



          
        
        } else {
          setMessage('Invalid credentials');
        }
      } catch (error) {
        console.error(error);
        setMessage('Login failed!');
      }
    };

    return (
      <div style={styles.container}>
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Admin Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <Link to="/admin/create" >create new accound</Link>
        <Link to="/forget" >forget password?</Link>
        <p>{message}</p>
      </div>
    );
  };

  const styles = {
    container: {
      marginTop: '100px',
      textAlign: 'center',
    },
    form: {
      display: 'inline-block',
      flexDirection: 'column',
    },
    input: {
      padding: '10px',
      margin: '10px',
      width: '200px',
    },
    button: {
      padding: '10px 20px',
    },
  };

  export default AdminLogin;
