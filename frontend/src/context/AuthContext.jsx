import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, X } from 'lucide-react';
import api from '../api/axios';

const AuthContext = createContext(null);

function getStoredCustomer() {
    try {
        const userType = localStorage.getItem('user_type');
        if (userType !== 'customer') return null;
        const raw = localStorage.getItem('auth_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredCustomer);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const navigate = useNavigate();

    // On mount, if we have a stored token, validate it by fetching the user
    useEffect(() => {
        const userType = localStorage.getItem('user_type');
        if (token && userType === 'customer') {
            api.get('/user')
                .then((res) => {
                    setUser(res.data);
                    localStorage.setItem('auth_user', JSON.stringify(res.data));
                })
                .catch((error) => {
                    if (error?.response?.status === 401) {
                        setToken(null);
                        setUser(null);
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('auth_user');
                        localStorage.removeItem('user_type');
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        const { user: userData, token: newToken } = res.data;

        setToken(newToken);
        setUser(userData);
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user_type', 'customer');

        return userData;
    };

    const register = async (formData) => {
        const res = await api.post('/register', formData);
        return res.data;
    };

    const setAuthData = (newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user_type', 'customer');
    };

    const googleLogin = async (credentialResponse) => {
        try {
            // GoogleLogin component returns { credential: JWT }
            const { credential } = credentialResponse;
            
            if (!credential) {
                throw new Error('No credential received from Google');
            }
            
            // Send JWT credential to backend for verification and user lookup
            const res = await api.post('/auth/google-login', { credential });
            
            const { user: userData, token: newToken } = res.data;
            setAuthData(newToken, userData);
            return userData;
        } catch (error) {
            console.error('Google login failed:', error);
            throw error;
        }
    };

    const googleSignup = async (credentialResponse) => {
        try {
            // GoogleLogin component returns { credential: JWT }
            const { credential } = credentialResponse;
            
            if (!credential) {
                throw new Error('No credential received from Google');
            }
            
            // Send JWT credential to backend for verification and user creation
            const res = await api.post('/auth/google-signup', { credential });
            
            const { user: userData, token: newToken } = res.data;
            setAuthData(newToken, userData);
            return userData;
        } catch (error) {
            console.error('Google signup failed:', error);
            throw error;
        }
    };

    const sendOtp = async (email) => {
        const res = await api.post('/send-otp', { email });
        return res.data;
    };

    const verifyOtp = async (email, otp) => {
        const res = await api.post('/verify-otp', { email, otp });
        return res.data;
    };

    const forgotPassword = async (email) => {
        const res = await api.post('/forgot-password', { email });
        return res.data;
    };

    const verifyResetOtp = async (email, otp) => {
        const res = await api.post('/verify-reset-otp', { email, otp });
        return res.data;
    };

    const resetPassword = async (reset_token, password, password_confirmation) => {
        const res = await api.post('/reset-password', { reset_token, password, password_confirmation });
        return res.data;
    };

    const changePassword = async (current_password, password, password_confirmation) => {
        const res = await api.post('/user/password', { current_password, password, password_confirmation });
        return res.data;
    };

    const updateProfile = async (data) => {
        const res = await api.put('/user', data);
        const updatedUser = res.data;
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        return updatedUser;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch {
            // Even if the API call fails, clear local state
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('user_type');
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        showLoginPrompt,
        setShowLoginPrompt,
        login,
        register,
        sendOtp,
        verifyOtp,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        changePassword,
        updateProfile,
        logout,
        setAuthData,
        googleLogin,
        googleSignup,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            
            {/* Global Login Required Modal (Modern Design) */}
            {showLoginPrompt && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060, backdropFilter: 'blur(4px)' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '400px' }}>
                        <div className="modal-content text-center p-4" style={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>

                            <button
                                type="button"
                                onClick={() => setShowLoginPrompt(false)}
                                style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#6B7280', padding: '8px', cursor: 'pointer', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <X size={20} />
                            </button>

                            <div style={{ width: '64px', height: '64px', backgroundColor: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: '#DC2626' }}>
                                <UserPlus size={32} />
                            </div>

                            <h4 className="fw-bold mb-2" style={{ color: '#111827', fontSize: '1.25rem' }}>Login to Continue</h4>
                            <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.75rem', padding: '0 10px' }}>
                                Create an account or log in to track your orders and checkout deliciously.
                            </p>

                            <div className="d-flex flex-column gap-2">
                                <button
                                    className="btn w-100 fw-bold d-flex align-items-center justify-content-center border-0"
                                    onClick={() => { setShowLoginPrompt(false); navigate('/login'); }}
                                    style={{ backgroundColor: '#991B1B', color: 'white', padding: '0.8rem', borderRadius: '12px', fontSize: '1rem', transition: 'transform 0.1s' }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    Log In
                                </button>
                                <button
                                    className="btn w-100 fw-bold d-flex align-items-center justify-content-center"
                                    onClick={() => { setShowLoginPrompt(false); navigate('/signup'); }}
                                    style={{ backgroundColor: 'transparent', color: '#111827', padding: '0.8rem', borderRadius: '12px', fontSize: '1rem', border: '1px solid #D1D5DB', transition: 'background-color 0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
