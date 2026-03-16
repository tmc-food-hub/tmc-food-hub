import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);

    // On mount, if we have a stored token, validate it by fetching the user
    useEffect(() => {
        const userType = localStorage.getItem('user_type');
        if (token && userType === 'customer') {
            api.get('/user')
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    // Token is invalid/expired
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    localStorage.removeItem('user_type');
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
        login,
        register,
        sendOtp,
        verifyOtp,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        updateProfile,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
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
