import axios from 'axios';

// ── Base URL Resolution ───────────────────────────────────────────────────────
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

// ── Auth Guard Configuration ──────────────────────────────────────────────────
// Maps each guard to its localStorage token key and login redirect path.
const AUTH_GUARDS = {
    customer: { tokenKey: 'auth_token',       loginPath: '/login' },
    owner:    { tokenKey: 'owner_auth_token',  loginPath: '/owner-login' },
    admin:    { tokenKey: 'admin_auth_token',  loginPath: '/admin-login' },
};

// Determines the guard from the request URL if not explicitly set.
function detectGuard(url) {
    if (url?.startsWith('/owner'))  return 'owner';
    if (url?.startsWith('/admin'))  return 'admin';
    return 'customer';
}

// ── Create the Axios Instance ─────────────────────────────────────────────────
const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ── Request Interceptor: Attach Bearer Token ──────────────────────────────────
api.interceptors.request.use((config) => {
    // Use explicit guard if provided via config.meta, otherwise detect from URL
    const guard = config.meta?.guard || detectGuard(config.url);
    const { tokenKey } = AUTH_GUARDS[guard] || AUTH_GUARDS.customer;

    const token = localStorage.getItem(tokenKey);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    // Store the resolved guard for the response interceptor
    config.meta = { ...config.meta, guard };

    return config;
});

// ── Response Interceptor: Refresh Token Flow + Toast Notifications ────────────

// Standalone toast system (decoupled from React since axios runs outside the component tree)
const toastQueue = [];
let toastContainer = null;

function showToast(message, type = 'info', duration = 4000) {
    // Prevent duplicate toasts with the same message
    if (toastQueue.includes(message)) return;
    toastQueue.push(message);

    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'api-toast-container';
        Object.assign(toastContainer.style, {
            position: 'fixed', top: '20px', right: '20px',
            display: 'flex', flexDirection: 'column', gap: '10px',
            zIndex: '99999', pointerEvents: 'none',
        });
        document.body.appendChild(toastContainer);
    }

    const colors = {
        error: { bg: '#EF4444', icon: '⚠️' },
        warning: { bg: '#F59E0B', icon: '🔄' },
        success: { bg: '#10B981', icon: '✅' },
        info: { bg: '#3B82F6', icon: 'ℹ️' },
    };
    const { bg, icon } = colors[type] || colors.info;

    const toast = document.createElement('div');
    Object.assign(toast.style, {
        backgroundColor: bg, color: 'white', padding: '14px 20px',
        borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        display: 'flex', alignItems: 'center', gap: '10px',
        minWidth: '280px', maxWidth: '400px', fontSize: '14px',
        fontWeight: '500', fontFamily: 'Inter,system-ui,sans-serif',
        transform: 'translateX(120%)', transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'auto',
    });
    toast.innerHTML = `<span>${icon}</span><span style="flex:1">${message}</span>`;
    toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });

    // Auto-remove
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => {
            toast.remove();
            const idx = toastQueue.indexOf(message);
            if (idx > -1) toastQueue.splice(idx, 1);
        }, 350);
    }, duration);
}

// ── Refresh token state (prevents concurrent refresh attempts) ────────────────
let isRefreshing = false;
let refreshSubscribers = []; // queued requests waiting for the new token

function subscribeToRefresh(callback) {
    refreshSubscribers.push(callback);
}

function onRefreshComplete(newToken) {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
}

function onRefreshFailed(error) {
    refreshSubscribers.forEach((cb) => cb(null, error));
    refreshSubscribers = [];
}

// Maps guards to their refresh and cleanup config
const REFRESH_ENDPOINTS = {
    customer: '/refresh-token',
    owner: '/owner/refresh-token',
    admin: '/admin/refresh-token',
};

const CLEANUP_KEYS = {
    customer: ['auth_token', 'auth_user', 'user_type'],
    owner: ['owner_auth_token', 'owner_auth_user', 'owner_user_type'],
    admin: ['admin_auth_token'],
};

function clearGuardTokens(guard) {
    (CLEANUP_KEYS[guard] || CLEANUP_KEYS.customer).forEach((key) => localStorage.removeItem(key));
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalConfig = error.config;

        // ── Retry once on network / timeout errors (offline detection) ─────
        if (!error.response && !originalConfig._retried) {
            originalConfig._retried = true;

            if (!navigator.onLine) {
                showToast('You appear to be offline. Reconnecting...', 'warning', 6000);

                const isBackOnline = await new Promise((resolve) => {
                    const timeout = setTimeout(() => resolve(false), 10000);
                    window.addEventListener('online', () => {
                        clearTimeout(timeout);
                        resolve(true);
                    }, { once: true });
                });

                if (isBackOnline) {
                    showToast('Back online!', 'success', 2000);
                    return api(originalConfig);
                }
                showToast('Still offline. Please check your connection.', 'error', 5000);
                return Promise.reject(new Error('You are offline. Please check your internet connection.'));
            }

            // Network error while online — show reconnecting toast and retry once
            showToast('Connection issue. Reconnecting...', 'warning', 3000);
            await new Promise((r) => setTimeout(r, 1000));
            return api(originalConfig);
        }

        // ── Handle 401 Unauthorized — Attempt Token Refresh First ──────────
        if (error.response?.status === 401 && !originalConfig._isRetryAfterRefresh) {
            const guard = originalConfig.meta?.guard || 'customer';
            const guardConfig = AUTH_GUARDS[guard] || AUTH_GUARDS.customer;
            const refreshEndpoint = REFRESH_ENDPOINTS[guard];

            // Skip refresh for login/register routes (401 is expected for bad credentials)
            const isAuthRoute = ['/login', '/register', '/owner/login', '/admin/login', '/refresh-token']
                .some((route) => originalConfig.url?.includes(route));

            if (isAuthRoute) {
                return Promise.reject(error);
            }

            // If there's a refresh endpoint for this guard, try it
            if (refreshEndpoint) {
                if (!isRefreshing) {
                    isRefreshing = true;

                    try {
                        // Attempt to refresh the token
                        const tokenKey = guardConfig.tokenKey;
                        const currentToken = localStorage.getItem(tokenKey);

                        if (!currentToken) {
                            throw new Error('No token to refresh');
                        }

                        const res = await axios.post(`${baseURL}${refreshEndpoint}`, {}, {
                            headers: {
                                Authorization: `Bearer ${currentToken}`,
                                Accept: 'application/json',
                            },
                        });

                        const { token: newToken, user } = res.data;

                        // Store the new token and user data for the guard
                        localStorage.setItem(tokenKey, newToken);
                        if (user) {
                            if (guard === 'customer') {
                                localStorage.setItem('auth_user', JSON.stringify(user));
                            } else if (guard === 'owner') {
                                localStorage.setItem('owner_auth_user', JSON.stringify(user));
                            }
                        }

                        isRefreshing = false;
                        onRefreshComplete(newToken);

                        // Retry the original request with the new token
                        originalConfig._isRetryAfterRefresh = true;
                        originalConfig.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalConfig);

                    } catch (refreshError) {
                        isRefreshing = false;
                        onRefreshFailed(refreshError);

                        // Refresh failed — clear tokens and redirect to login
                        clearGuardTokens(guard);
                        showToast('Session expired. Please log in again.', 'error', 5000);

                        setTimeout(() => {
                            window.location.href = guardConfig.loginPath;
                        }, 1500);

                        return Promise.reject(refreshError);
                    }
                } else {
                    // Another refresh is already in progress — queue this request
                    return new Promise((resolve, reject) => {
                        subscribeToRefresh((newToken, err) => {
                            if (err || !newToken) {
                                return reject(error);
                            }
                            originalConfig._isRetryAfterRefresh = true;
                            originalConfig.headers.Authorization = `Bearer ${newToken}`;
                            resolve(api(originalConfig));
                        });
                    });
                }
            }

            // No refresh endpoint for this guard — fall back to logout
            clearGuardTokens(guard);
            showToast('Session expired. Please log in again.', 'error', 5000);

            setTimeout(() => {
                window.location.href = guardConfig.loginPath;
            }, 1500);
        }

        return Promise.reject(error);
    }
);

export default api;

