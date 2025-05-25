import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SignUp = () => {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/auth/register/', form);
            alert("Registration successful! Please log in.");
            navigate('/');
        } catch (err) {
            alert("Registration failed.");
            console.error(err.response?.data);
        }
    };

    return (
        <div>
            <h1>Welcome to the Document Management System</h1>
            <p>Please sign up to create an account.</p>
            <form onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
                <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required />
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
    );
};

export default SignUp;