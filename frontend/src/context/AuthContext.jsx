import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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

    const login = useCallback(async (email, password) => {
        const res = await api.post('/login', { email, password });
        const { user: userData, token: newToken } = res.data;

        setToken(newToken);
        setUser(userData);
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user_type', 'customer');

        return userData;
    }, []);

    const register = useCallback(async (formData) => {
        const res = await api.post('/register', formData);
        return res.data;
    }, []);

    const setAuthData = useCallback((newToken, userData) => {
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('user_type', 'customer');
    }, []);

    const sendOtp = useCallback(async (email) => {
        const res = await api.post('/send-otp', { email });
        return res.data;
    }, []);

    const verifyOtp = useCallback(async (email, otp) => {
        const res = await api.post('/verify-otp', { email, otp });
        return res.data;
    }, []);

    const forgotPassword = useCallback(async (email) => {
        const res = await api.post('/forgot-password', { email });
        return res.data;
    }, []);

    const verifyResetOtp = useCallback(async (email, otp) => {
        const res = await api.post('/verify-reset-otp', { email, otp });
        return res.data;
    }, []);

    const resetPassword = useCallback(async (reset_token, password, password_confirmation) => {
        const res = await api.post('/reset-password', { reset_token, password, password_confirmation });
        return res.data;
    }, []);

    const changePassword = useCallback(async (current_password, password, password_confirmation) => {
        const res = await api.post('/user/password', { current_password, password, password_confirmation });
        return res.data;
    }, []);

    const updateProfile = useCallback(async (data) => {
        const res = await api.put('/user', data);
        const updatedUser = res.data;
        setUser(updatedUser);
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        return updatedUser;
    }, []);

    const logout = useCallback(async () => {
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
    }, []);

    const value = useMemo(() => ({
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
        changePassword,
        updateProfile,
        logout,
        setAuthData,
    }), [user, token, loading, login, register, sendOtp, verifyOtp, forgotPassword, verifyResetOtp, resetPassword, changePassword, updateProfile, logout, setAuthData]);

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
