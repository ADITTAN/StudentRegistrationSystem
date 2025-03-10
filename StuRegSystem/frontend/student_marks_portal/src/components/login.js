import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosConfig';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Student', // Default role is Student
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const endpoint = formData.role === 'Student' ? '/StudentLogin' : '/TeacherLogin';
            const response = await API.post(endpoint, formData);

            alert('Login Successful!');
            
            // Redirect based on role
            if (formData.role === 'Student') {
                navigate('/marks');
            } else {
                navigate('/marks'); // Change if teachers need a different route
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Something went wrong';

            // If email is not found, recommend registering
            if (errorMessage.toLowerCase().includes('email not found')) {
                setError(
                    <>
                        {errorMessage} <br />
                        <button className="register-btn" onClick={() => navigate('/register')}>
                            Register Here
                        </button>
                    </>
                );
            } else {
                setError(errorMessage);
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                </select>

                <button type="submit">Login</button>
            </form>

            {/* Register Button */}
            <button className="register-btn" onClick={() => navigate('/register')}>
                Register
            </button>
        </div>
    );
};

export default Login;
