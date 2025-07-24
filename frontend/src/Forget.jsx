import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
    const [name, setName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:8000/api/admin/forgot-password/', {
                name: name,
                new_password: newPassword
            });
            setMessage(res.data.message);
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.error);
            } else {
                setMessage("Something went wrong.");
            }
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <h2>Reset Password</h2>
            <form onSubmit={handleReset}>
                <div>
                    <label>Username</label><br />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>New Password</label><br />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
