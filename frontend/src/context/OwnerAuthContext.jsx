import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../api/axios';
import { getStores, saveStores } from '../data/storesData';

const OwnerAuthContext = createContext(null);

export function OwnerAuthProvider({ children }) {
    const [currentOwner, setCurrentOwner] = useState(null);
    const [stores, setStores] = useState(() => getStores());
    const [loading, setLoading] = useState(true);

    // Persist stores whenever they change
    useEffect(() => { saveStores(stores); }, [stores]);

    // Validate owner on mount or token change
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const userType = localStorage.getItem('user_type');
        
        if (token && userType === 'owner') {
            api.get('/owner/user')
                .then(res => {
                    const user = res.data;
                    // Match user.restaurant_name to local stores data for compatibility
                    const matchedStore = stores.find(s => s.name === user.restaurant_name);
                    setCurrentOwner({
                        ...user,
                        storeId: matchedStore?.id || 1, // Fallback if not found
                        storeName: user.restaurant_name
                    });
                })
                .catch(() => {
                    setCurrentOwner(null);
                    localStorage.removeItem('user_type');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [stores]);

    async function login(email, password) {
        try {
            const res = await api.post('/owner/login', { email, password });
            const { user, token } = res.data;

            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
            localStorage.setItem('user_type', 'owner');

            const matchedStore = stores.find(s => s.name === user.restaurant_name);
            const ownerData = {
                ...user,
                storeId: matchedStore?.id || 1,
                storeName: user.restaurant_name
            };

            setCurrentOwner(ownerData);
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

    // Get the store this owner manages
    const ownerStore = useMemo(() => {
        if (!currentOwner) return null;
        return stores.find(s => s.id === currentOwner.storeId) || stores[0];
    }, [currentOwner, stores]);

    // Update only this owner's store
    function updateStore(updatedStore) {
        setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
    }

    const value = {
        currentOwner,
        ownerStore,
        login,
        logout,
        updateStore,
        stores,
        loading
    };

    return (
        <OwnerAuthContext.Provider value={value}>
            {children}
        </OwnerAuthContext.Provider>
    );
}

export function useOwnerAuth() { return useContext(OwnerAuthContext); }
