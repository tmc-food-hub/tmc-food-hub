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
    const apiOrigin = getApiOrigin();

    try {
        const url = new URL(path, window.location.origin);
        
        // Extract the core path after /api/media/ or /storage/
        let corePath = '';
        if (url.pathname.includes('/api/media/')) {
            corePath = url.pathname.slice(url.pathname.indexOf('/api/media/') + 11);
        } else if (url.pathname.includes('/storage/')) {
            corePath = url.pathname.slice(url.pathname.indexOf('/storage/') + 9);
        } else {
            corePath = url.pathname.replace(/^\/+/, '');
        }

        // Always force through /api/media/ to guarantee routing works
        return `${apiOrigin}/api/media/${corePath}${url.search}${url.hash}`;
    } catch {
        // Fallback for completely unparseable paths
        let corePath = path.replace(/^\/+/, '');
        if (corePath.startsWith('api/media/')) corePath = corePath.slice(10);
        else if (corePath.startsWith('storage/')) corePath = corePath.slice(8);
        
        return `${apiOrigin}/api/media/${corePath}`;
    }
}

export function resolveMediaUrl(path) {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('blob:') || path.startsWith('data:')) return path;
    
    // Normalize backslashes to forward slashes for cross-browser compatibility (Safari/Firefox)
    let normalizedPath = path.replace(/\\/g, '/');

    const origin = getApiOrigin();

    // If the backend returns a fully qualified URL to the media endpoint but with a wrong host 
    // (e.g. localhost in production), we intercept it and swap it with the correct origin.
    if (normalizedPath.includes('/api/media/') || normalizedPath.includes('/storage/')) {
        return resolveManagedMediaUrl(normalizedPath);
    }

    // Intercept any localhost or 127.0.0.1 absolute URLs (e.g. assets) that the backend might have generated
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(normalizedPath)) {
        try {
            const url = new URL(normalizedPath);
            return `${origin}${url.pathname}${url.search}${url.hash}`;
        } catch {
            // fallback
        }
    }

    if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;
    if (normalizedPath.startsWith('//')) return `${window.location.protocol}${normalizedPath}`;

    if (normalizedPath.startsWith('/assets/')) return normalizedPath;

    if (normalizedPath.startsWith('/')) {
        return `${origin}${normalizedPath}`;
    }

    return `${origin}/${normalizedPath}`;
}
