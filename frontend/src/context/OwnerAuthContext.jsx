import React, { createContext, useContext, useState, useEffect } from 'react';
import { ownerCredentials, getStores, saveStores } from '../data/storesData';

const OwnerAuthContext = createContext(null);

export function OwnerAuthProvider({ children }) {
    const [currentOwner, setCurrentOwner] = useState(() => {
        try { return JSON.parse(localStorage.getItem('tmcOwner')) || null; }
        catch { return null; }
    });

    // stores state — seeded from localStorage or defaults
    const [stores, setStores] = useState(() => getStores());

    // Persist owner to localStorage whenever it changes
    useEffect(() => {
        if (currentOwner) localStorage.setItem('tmcOwner', JSON.stringify(currentOwner));
        else localStorage.removeItem('tmcOwner');
    }, [currentOwner]);

    // Persist stores whenever they change
    useEffect(() => { saveStores(stores); }, [stores]);

    function login(email, password) {
        const cred = ownerCredentials.find(
            c => c.email === email.trim() && c.password === password
        );
        if (!cred) return { success: false, message: 'Invalid email or password.' };
        const store = stores.find(s => s.id === cred.storeId);
        setCurrentOwner({ storeId: cred.storeId, email: cred.email, storeName: store?.name });
        return { success: true };
    }

    function logout() { setCurrentOwner(null); }

    // Get the store this owner manages
    const ownerStore = currentOwner ? stores.find(s => s.id === currentOwner.storeId) : null;

    // Update only this owner's store
    function updateStore(updatedStore) {
        setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
    }

    return (
        <OwnerAuthContext.Provider value={{ currentOwner, ownerStore, login, logout, updateStore, stores }}>
            {children}
        </OwnerAuthContext.Provider>
    );
}

export function useOwnerAuth() { return useContext(OwnerAuthContext); }
