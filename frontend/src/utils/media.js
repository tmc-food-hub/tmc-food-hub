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
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith('//')) return `${window.location.protocol}${path}`;

    if (path.startsWith('/assets/')) return path;

    const origin = getApiOrigin();

    if (path.startsWith('/')) {
        return `${origin}${path}`;
    }

    return `${origin}/${path}`;
}
