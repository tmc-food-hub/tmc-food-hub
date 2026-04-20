import api from '../api/axios';

function getApiBaseUrl() {
    try {
        return new URL(api.defaults.baseURL, window.location.origin);
    } catch {
        return new URL(window.location.origin);
    }
}

function getApiOrigin() {
    return getApiBaseUrl().origin;
}

function getApiPrefixPath() {
    const pathname = getApiBaseUrl().pathname.replace(/\/+$/, '');

    if (pathname === '/api' || pathname.endsWith('/api')) {
        return pathname.slice(0, -4);
    }

    return '';
}

function resolveManagedMediaUrl(path) {
    const prefix = getApiPrefixPath();
    const apiOrigin = getApiOrigin();

    try {
        const url = new URL(path, window.location.origin);
        const managedPath = url.pathname.includes('/api/media/')
            ? url.pathname.slice(url.pathname.indexOf('/api/media/'))
            : url.pathname.includes('/storage/')
                ? url.pathname.slice(url.pathname.indexOf('/storage/'))
                : url.pathname;

        return `${apiOrigin}${prefix}${managedPath}${url.search}${url.hash}`;
    } catch {
        return `${apiOrigin}${prefix}${path.startsWith('/') ? path : `/${path}`}`;
    }
}

export function resolveMediaUrl(path) {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('blob:') || path.startsWith('data:')) return path;
    
    const origin = getApiOrigin();

    // If the backend returns a fully qualified URL to the media endpoint but with a wrong host 
    // (e.g. localhost in production), we intercept it and swap it with the correct origin.
    if (path.includes('/api/media/') || path.includes('/storage/')) {
        return resolveManagedMediaUrl(path);
    }

    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('//')) return `${window.location.protocol}${path}`;

    if (path.startsWith('/assets/')) return path;

    if (path.startsWith('/')) {
        return `${origin}${path}`;
    }

    return `${origin}/${path}`;
}
