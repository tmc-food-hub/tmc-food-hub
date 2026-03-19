import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

const OwnerAuthContext = createContext(null);

export function OwnerAuthProvider({ children }) {
    const [currentOwner, setCurrentOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    // Validate owner on mount via token
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const userType = localStorage.getItem('user_type');

        if (token && userType === 'owner') {
            api.get('/owner/user')
                .then(res => {
                    setCurrentOwner(buildOwner(res.data));
                })
                .catch(() => {
                    setCurrentOwner(null);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    localStorage.removeItem('user_type');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    function buildOwner(user) {
        return {
            ...user,
            // The owner's DB id IS the restaurant owner id used in orders
            storeId: user.id,
            storeName: user.restaurant_name,
        };
    }

    async function login(email, password) {
        try {
            const res = await api.post('/owner/login', { email, password });
            const { user, token } = res.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            localStorage.setItem('user_type', 'owner');

            setCurrentOwner(buildOwner(user));
            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            const message = error.response?.data?.message || 'Invalid email or password.';
            return { success: false, message };
        }
    }

    async function logout() {
        try {
            await api.post('/owner/logout');
        } catch (e) {
            console.error('Logout failed:', e);
        }
        setCurrentOwner(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('user_type');
    }

    // Build a store-shaped object from the owner's DB data
    const ownerStore = useMemo(() => {
        if (!currentOwner) return null;
        return {
            id: currentOwner.id,               // Real DB restaurant_owner_id
            storeId: currentOwner.id,
            name: currentOwner.restaurant_name,
            branchName: currentOwner.restaurant_name,
            location: currentOwner.business_address,
            phone: currentOwner.business_contact_number,
            logo: currentOwner.logo || null,
            cover: currentOwner.cover_image || null,
            status: 'Operational',
            rating: 5.0,
            deliveryTime: '30-45 min',
            minOrder: '₱100.00',
            // Personal info
            firstName: currentOwner.first_name,
            lastName: currentOwner.last_name,
            email: currentOwner.email,
            businessPermit: currentOwner.business_permit,
        };
    }, [currentOwner]);

    // Refresh owner profile from the API (e.g. after profile update)
    async function refreshOwner() {
        try {
            const res = await api.get('/owner/user');
            setCurrentOwner(buildOwner(res.data));
        } catch (e) {
            console.error('Failed to refresh owner:', e);
        }
    }

    // Update the store in context after a profile update
    function updateStore(updatedData) {
        setCurrentOwner(prev => prev ? { ...prev, ...updatedData } : prev);
    }

    const value = {
        currentOwner,
        ownerStore,
        login,
        logout,
        updateStore,
        refreshOwner,
        loading,
    };

    return (
        <OwnerAuthContext.Provider value={value}>
            {children}
        </OwnerAuthContext.Provider>
    );
}

export function useOwnerAuth() { return useContext(OwnerAuthContext); }
