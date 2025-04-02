import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Register() {
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    phone_number: '',
    age: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'citizen',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/register', {
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        phone_number: form.phone_number,
        age: form.age,
        username: form.username,
        role: form.role,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required 
          />
          <input 
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required 
          />
          <input 
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            required 
          />
          <input 
            type="text"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            required 
          />
          <input 
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required 
          />
          <input 
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required 
          />
          <input 
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required 
          />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="citizen">Citizen</option>
            <option value="city_staff">City Staff</option>
          </select>
          <button type="submit" className="auth-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
