import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

const OwnerAuthContext = createContext(null);

function getStoredOwner() {
    try {
        const userType = localStorage.getItem('user_type');
        if (userType !== 'owner') return null;
        const raw = localStorage.getItem('auth_user');
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function getDefaultRestaurantImage(restaurantName = '') {
    if (restaurantName.includes('Jollibee')) return '/assets/images/service/resturant_logo/jollibee.svg';
    if (restaurantName.includes("McDonald's") || restaurantName.includes('McDonald')) return '/assets/images/service/resturant_logo/mcdonald-s-7.svg';
    if (restaurantName.includes('Sushi Nori')) return '/assets/images/service/resturant_logo/sushi-nori.svg';
    if (restaurantName.includes('Mang Inasal')) return '/assets/images/service/resturant_logo/Mang_Inasal.svg';
    if (restaurantName.includes('KFC')) return '/assets/images/service/resturant_logo/KFC.svg';
    if (restaurantName.includes('Chowking')) return '/assets/images/service/resturant_logo/chowking.svg';

    return '/assets/images/service/placeholder.svg';
}

export function OwnerAuthProvider({ children }) {
    const [currentOwner, setCurrentOwner] = useState(() => {
        const stored = getStoredOwner();
        return stored ? buildOwner(stored) : null;
    });
    const [loading, setLoading] = useState(true);

    // Validate owner on mount via token
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const userType = localStorage.getItem('user_type');

        if (token && userType === 'owner') {
            api.get('/owner/user')
                .then(res => {
                    setCurrentOwner(buildOwner(res.data));
                    localStorage.setItem('auth_user', JSON.stringify(res.data));
                })
                .catch((error) => {
                    if (error?.response?.status === 401) {
                        setCurrentOwner(null);
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

    function buildOwner(user) {
        const fallbackImage = getDefaultRestaurantImage(user.restaurant_name);

        return {
            ...user,
            storeId: user.id,
            storeName: user.restaurant_name,
            logo: user.logo || fallbackImage,
            cover_image: user.cover_image || fallbackImage,
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
            id: currentOwner.id,
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
            personalPhone: currentOwner.phone,
            personalAddress: currentOwner.address,
            businessPermit: currentOwner.business_permit,
            // Restaurant profile fields
            cuisineType: currentOwner.cuisine_type || [],
            priceRange: currentOwner.price_range || '',
            businessRegistrationNumber: currentOwner.business_registration_number || '',
            emailVerifiedAt: currentOwner.email_verified_at,
        };
    }, [currentOwner]);

    // Refresh owner profile from the API (e.g. after profile update)
    async function refreshOwner() {
        try {
            const res = await api.get('/owner/user');
            setCurrentOwner(buildOwner(res.data));
            localStorage.setItem('auth_user', JSON.stringify(res.data));
        } catch (e) {
            console.error('Failed to refresh owner:', e);
        }
    }

    // Update the store in context after a profile update
    function updateStore(updatedData) {
        setCurrentOwner(prev => {
            if (!prev) return prev;
            const next = { ...prev, ...updatedData };
            localStorage.setItem('auth_user', JSON.stringify(next));
            return next;
        });
    }

    // Set auth data directly after registration
    function setAuthData(token, user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('user_type', 'owner');
        setCurrentOwner(buildOwner(user));
    }

    const value = {
        currentOwner,
        ownerStore,
        login,
        logout,
        updateStore,
        refreshOwner,
        setAuthData,
        loading,
    };

    return (
        <OwnerAuthContext.Provider value={value}>
            {children}
        </OwnerAuthContext.Provider>
    );
}

export function useOwnerAuth() { return useContext(OwnerAuthContext); }
