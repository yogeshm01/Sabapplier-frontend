import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/auth/login/', form);
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            alert("Login failed");
            console.error(err.response?.data);
        }
    };

    return (
        <div>
            <h1>Welcome to the Document Management System</h1>
            <p>Please log in to continue.</p>
            
            <form onSubmit={handleLogin}>
                <h2>Login</h2>
                <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
                <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>

    );
};

export default Login;