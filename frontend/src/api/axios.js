import axios from 'axios';

// Use Herd .test domain or standard localhost:8000 in dev, production backend URL when deployed
const hostname = window.location.hostname;
const baseURL = hostname.endsWith('.test')
    ? 'https://tmc-backend.test/api'
    : (hostname === 'localhost' || hostname === '127.0.0.1')
        ? 'http://127.0.0.1:8000/api'
        : 'https://foodhub.tmc-innovations.com/api';

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

// On 401, clear stored auth
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
        return Promise.reject(error);
    }
);

export default api;
