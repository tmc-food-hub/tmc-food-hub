import api from '../api/axios';

function getApiOrigin() {
    try {
        return new URL(api.defaults.baseURL, window.location.origin).origin;
    } catch {
        return window.location.origin;
    }
}

export function resolveMediaUrl(path) {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('blob:') || path.startsWith('data:')) return path;
    
    const origin = getApiOrigin();

    // If the backend returns a fully qualified URL to the media endpoint but with a wrong host 
    // (e.g. localhost in production), we intercept it and swap it with the correct origin.
    if (path.includes('/api/media/') || path.includes('/storage/')) {
        try {
            // Extract the pathname from the absolute or relative URL
            const urlObj = new URL(path, window.location.origin);
            return `${origin}${urlObj.pathname}`;
        } catch {
            // Fallback if URL parsing fails
        }
    }

    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('//')) return `${window.location.protocol}${path}`;

    if (path.startsWith('/assets/')) return path;

    if (path.startsWith('/')) {
        return `${origin}${path}`;
    }

    return `${origin}/${path}`;
}
