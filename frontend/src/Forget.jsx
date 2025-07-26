import React, { useState } from 'react';
import axios from 'axios';
import { FiKey, FiUser, FiLock, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [name, setName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const res = await axios.post('http://localhost:8000/api/admin/forgot-password/', {
                name: name,
                new_password: newPassword
            });
            setMessage(res.data.message || "Password reset successfully!");
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-auth-container">
            <div className="admin-auth-card">
                <div className="auth-header">
                    <div className="auth-logo">
                        {/* <FiKey size={28} /> */}
                        {/* <span>Admin Portal</span> */}
                    </div>
                    <h2>Reset Password</h2>
                    {/* <p>Enter your credentials to set a new password</p> */}
                </div>

                <form onSubmit={handleReset} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="username">
                            <FiUser size={16} /> Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="newPassword">
                            <FiLock size={16} /> New Password
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : (
                            <>
                                <FiArrowRight size={18} /> Reset Password
                            </>
                        )}
                    </button>

                    {message && (
                        <div className={`auth-message ${message.includes('success') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <div className="auth-footer">
                        Remember your password? <Link to="/admin">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

// CSS Styles
const styles = `
    .admin-auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        padding: 20px;
    }

    .admin-auth-card {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 420px;
        padding: 40px;
    }

    .auth-header {
        text-align: center;
        margin-bottom: 30px;
    }

    .auth-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        color: #4a6bff;
        font-weight: 600;
        margin-bottom: 15px;
    }

    .auth-header h2 {
        color: #2d3748;
        margin-bottom: 8px;
        font-size: 24px;
    }

    .auth-header p {
        color: #718096;
        font-size: 14px;
    }

    .auth-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .input-group label {
        font-size: 14px;
        color: #4a5568;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .input-group input {
        padding: 14px 16px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.2s ease;
    }

    .input-group input:focus {
        border-color: #4a6bff;
        box-shadow: 0 0 0 3px rgba(74, 107, 255, 0.1);
        outline: none;
    }

    .auth-button {
        background: #4a6bff;
        color: white;
        border: none;
        padding: 14px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: all 0.2s ease;
    }

    .auth-button:hover {
        background: #3a56db;
    }

    .auth-button:disabled {
        background: #c3cfe2;
        cursor: not-allowed;
    }

    .auth-message {
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        text-align: center;
    }

    .auth-message.success {
        background: #f0fff4;
        color: #2f855a;
        border: 1px solid #c6f6d5;
    }

    .auth-message.error {
        background: #fff5f5;
        color: #c53030;
        border: 1px solid #fed7d7;
    }

    .auth-footer {
        text-align: center;
        font-size: 14px;
        color: #718096;
        margin-top: 10px;
    }

    .auth-footer a {
        color: #4a6bff;
        text-decoration: none; 
        transition: color 0.2s ease;
    }

    .auth-footer a:hover {
        color: #3a56db;
        text-decoration: underline;
    }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default ResetPassword;