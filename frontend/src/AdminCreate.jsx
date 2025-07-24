import React, { useState } from "react";
import axios from "axios";

const AdminCreatePage = () => {
  const [adminData, setAdminData] = useState({ name: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/admin/create/", adminData);
      setMessage("Admin created successfully!");
      setAdminData({ name: "", password: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error creating admin.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Admin</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Admin Name"
          value={adminData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={adminData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Create Admin</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "2rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
  },
  button: {
    padding: "0.5rem",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default AdminCreatePage;
