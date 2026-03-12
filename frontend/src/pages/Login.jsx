import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            setError(null);
            setIsLoading(true);
            const { credential } = credentialResponse;
            
            const { data } = await authService.googleLogin({ credential });
            
            // Store JWT securely
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            if (data.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Google login failed:', err);
            setError(err.response?.data?.message || 'Failed to authenticate with Google.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError('Google Login was unsuccessful. Please try again.');
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            setIsLoading(true);
            const { data } = await authService.login({ email, password });
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            if (data.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--color-secondary)', fontFamily: 'var(--font-sans)' }}>
            {/* Left Box - Branding */}
            <div className="hidden lg:flex" style={{ flex: 1, backgroundColor: 'var(--color-dark)', color: 'white', alignItems: 'center', justifyContent: 'center', padding: '40px', flexDirection: 'column', textAlign: 'center' }}>
                <i className="ri-building-4-fill" style={{ fontSize: '64px', color: 'var(--color-primary)', marginBottom: '16px' }}></i>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>SR Property Advisors</h1>
                <p style={{ color: 'var(--color-muted)', maxWidth: '400px', fontSize: '18px', padding: '0 20px' }}>
                    Enterprise Real Estate Management & CRM Platform
                </p>
            </div>

            {/* Right Box - Login Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div style={{ width: '100%', maxWidth: '420px', backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
                    
                    <div className="lg:hidden text-center mb-6">
                        <i className="ri-building-4-fill" style={{ fontSize: '48px', color: 'var(--color-primary)' }}></i>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px', color: 'var(--color-dark)' }}>SR Property Advisors</h1>
                    </div>

                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: 'var(--color-dark)' }}>Welcome back</h2>
                    <p style={{ color: 'var(--color-muted)', marginBottom: '32px' }}>Please enter your details to sign in.</p>

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--color-dark)', marginBottom: '8px' }}>Email</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', transition: 'border-color 0.2s', minHeight: '48px', fontSize: '16px' }} 
                                placeholder="name@company.com" 
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'var(--color-dark)', marginBottom: '8px' }}>Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', transition: 'border-color 0.2s', minHeight: '48px', fontSize: '16px' }} 
                                placeholder="••••••••" 
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-muted)', cursor: 'pointer' }}>
                                <input type="checkbox" style={{ accentColor: 'var(--color-primary)' }} />
                                Remember for 30 days
                            </label>
                            <a href="#" style={{ color: 'var(--color-primary)', fontWeight: '500', textDecoration: 'none' }}>Forgot password?</a>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                backgroundColor: 'var(--color-primary)', 
                                color: 'white', 
                                borderRadius: '8px', 
                                fontWeight: '600', 
                                border: 'none', 
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                transition: 'background-color 0.2s',
                                minHeight: '48px',
                                fontSize: '16px'
                            }}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
                        <span style={{ padding: '0 16px', color: 'var(--color-muted)', fontSize: '14px' }}>or continue with</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap
                            theme="outline"
                            size="large"
                            text="continue_with"
                            shape="rectangular"
                            width="100%"
                        />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'var(--color-muted)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none' }}>Create an account</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
