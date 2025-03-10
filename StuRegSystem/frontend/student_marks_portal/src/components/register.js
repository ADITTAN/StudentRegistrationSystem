import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import API from '../api/axiosConfig'; // Ensure axiosConfig is correctly set up

const Register = () => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: 'Student', // Default role is Student
        profilePicture: null,
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePicture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('id', formData.id);
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('email', formData.email);
        formDataToSubmit.append('password', formData.password);
        formDataToSubmit.append('role', formData.role);

        if (formData.profilePicture) {
            formDataToSubmit.append('profilePicture', formData.profilePicture);
        }

        try {
            const endpoint = formData.role === 'Student' ? '/StudentReg' : '/TeacherReg';
            await API.post(endpoint, formDataToSubmit, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Registration Successful!');
            navigate('/'); // Navigate to login page
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    const handleUpdate = async () => {
        setError(null);

        const formDataToUpdate = new FormData();
        formDataToUpdate.append('name', formData.name);
        formDataToUpdate.append('email', formData.email);
        formDataToUpdate.append('role', formData.role);

        if (formData.profilePicture) {
            formDataToUpdate.append('profilePicture', formData.profilePicture);
        }

        try {
            const endpoint = formData.role === 'Student' ? `/Student/${formData.id}` : `/Teacher/${formData.id}`;
            await API.put(endpoint, formDataToUpdate, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('Update Successful!');
            navigate('/'); // Redirect to login page after update
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;

        try {
            const endpoint = formData.role === 'Student' ? `/Student/${formData.id}` : `/Teacher/${formData.id}`;
            await API.delete(endpoint);

            alert('Account Deleted!');
            navigate('/register'); // Redirect to register page after deletion
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>{formData.role} Registration</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="id" placeholder="ID" onChange={handleChange} required />
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                </select>

                <input type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} />

                <button type="submit">Register</button>
                <button type="button" onClick={handleUpdate}>Update</button>
                <button type="button" onClick={handleDelete} className="delete-btn">Delete</button>
            </form>
        </div>
    );
};

export default Register;
