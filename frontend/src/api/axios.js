import axios from 'axios';

// API base URL resolution:
// 1. If VITE_API_URL is set in frontend/.env, use that (e.g. https://tmc-backend.test/api for Herd users)
// 2. If accessed via a .test domain, use the Herd backend
// 3. If on localhost, default to php artisan serve (http://127.0.0.1:8000/api)
// 4. Otherwise, use the production backend
const hostname = window.location.hostname;
const isLocal = hostname === 'localhost' 
    || hostname === '127.0.0.1' 
    || hostname.startsWith('192.168.') 
    || hostname.startsWith('10.') 
    || hostname.startsWith('172.')
    || hostname.endsWith('.local')
    || hostname.endsWith('.test');

const baseURL = import.meta.env.VITE_API_URL
    || (isLocal
        ? (hostname.endsWith('.test') ? 'https://tmc-backend.test/api' : 'http://127.0.0.1:8000/api')
        : 'https://foodhub.tmc-innovations.com/api');

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401, clear all stored auth state
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('user_type');
        }
        return Promise.reject(error);
    }
);

export default api;
