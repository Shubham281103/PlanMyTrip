import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }
        if (!username || !email || !mobile || !address || !password) {
            setError('All fields are required.');
            return;
        }
        try {
            await apiClient.post('/register', {
                username,
                email,
                mobile_number: mobile,
                address,
                password
            });
            setSuccess('Registration successful! Please login.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Username or email already exists or another error occurred.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center">
                <span style={{ fontSize: 28, fontWeight: 700, color: '#4f46e5' }} className="mb-1 tracking-wide">PlanMyTrip</span>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827' }} className="mb-6">Create your account</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <div>
                        <label htmlFor="username" style={{ fontSize: 14, fontWeight: 500 }} className="block text-gray-700">Username</label>
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="email" style={{ fontSize: 14, fontWeight: 500 }} className="block text-gray-700">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="mobile" style={{ fontSize: 14, fontWeight: 500 }} className="block text-gray-700">Mobile Number</label>
                        <input id="mobile" type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="address" style={{ fontSize: 14, fontWeight: 500 }} className="block text-gray-700">Address</label>
                        <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="password" style={{ fontSize: 14, fontWeight: 500 }} className="block text-gray-700">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Register</button>
                    <p className="text-center text-sm text-gray-600">Already have an account?{' '}<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login here</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Register; 