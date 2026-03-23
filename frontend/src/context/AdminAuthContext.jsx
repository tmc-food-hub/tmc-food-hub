import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AdminAuthContext = createContext(null);

function getStoredAdmin() {
    try {
        const userType = localStorage.getItem('admin_user_type');
        if (userType !== 'admin') return null;
        const raw = localStorage.getItem('admin_auth_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(getStoredAdmin);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin_auth_token');
        const userType = localStorage.getItem('admin_user_type');

        if (token && userType === 'admin') {
            api.get('/admin/user')
                .then((res) => {
                    setAdmin(res.data);
                    localStorage.setItem('admin_auth_user', JSON.stringify(res.data));
                })
                .catch((error) => {
                    if (error?.response?.status === 401 || error?.response?.status === 403) {
                        setAdmin(null);
                        localStorage.removeItem('admin_auth_token');
                        localStorage.removeItem('admin_auth_user');
                        localStorage.removeItem('admin_user_type');
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    async function login(email, password) {
        try {
            const res = await api.post('/admin/login', { email, password });
            const { user, token } = res.data;

            setAdmin(user);
            localStorage.setItem('admin_auth_token', token);
            localStorage.setItem('admin_auth_user', JSON.stringify(user));
            localStorage.setItem('admin_user_type', 'admin');

            return { success: true };
        } catch (error) {
            console.error('Admin login failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.response?.data?.errors?.email?.[0] || 'Invalid admin credentials.',
            };
        }
    }

    async function logout() {
        try {
            await api.post('/admin/logout');
        } catch (error) {
            console.error('Admin logout failed:', error);
        }

        setAdmin(null);
        localStorage.removeItem('admin_auth_token');
        localStorage.removeItem('admin_auth_user');
        localStorage.removeItem('admin_user_type');
    }

    return (
        <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}
