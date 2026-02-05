import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const { login, signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                if (formData.password !== formData.confirmPassword) {
                    return setError('Passwords do not match');
                }
                await signup(formData);
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="form-row">
                            <input name="firstName" placeholder="First Name" onChange={handleChange} required />
                            <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
                        </div>
                    )}
                    <input name="email" type="email" placeholder="Email Id" onChange={handleChange} required />
                    {!isLogin && <input name="phone" placeholder="Contact Number" onChange={handleChange} required />}
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                    {!isLogin && <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} required />}

                    <div className="auth-footer">
                        <p onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Create a new account' : 'Already have an Account? Login'}
                        </p>
                        <button type="submit" className="btn-primary">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Auth;
