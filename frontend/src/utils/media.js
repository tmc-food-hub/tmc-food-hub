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

function buildApiMediaBase() {
    const apiOrigin = getApiOrigin();
    const apiPrefixPath = getApiPrefixPath();

    return `${apiOrigin}${apiPrefixPath}/api/media`;
}

function stripManagedMediaPrefix(path) {
    let normalizedPath = path.replace(/\\/g, '/').trim();

    if (!normalizedPath) return '';

    if (/^https?:\/\//i.test(normalizedPath) || normalizedPath.startsWith('//')) {
        try {
            const url = new URL(normalizedPath, window.location.origin);
            normalizedPath = url.pathname;
        } catch {
            // Keep the raw input if URL parsing fails.
        }
    }

    normalizedPath = normalizedPath.replace(/^\/+/, '');

    if (normalizedPath.startsWith('api/media/')) {
        normalizedPath = normalizedPath.slice('api/media/'.length);
    }

    if (normalizedPath.startsWith('storage/')) {
        normalizedPath = normalizedPath.slice('storage/'.length);
    }

    return normalizedPath.replace(/^\/+/, '');
}

function encodeManagedMediaPath(path) {
    return stripManagedMediaPrefix(path)
        .split('/')
        .filter(Boolean)
        .map(segment => encodeURIComponent(segment))
        .join('/');
}

function isManagedMediaPath(path) {
    const normalizedPath = stripManagedMediaPrefix(path).toLowerCase();

    return normalizedPath.startsWith('restaurants/')
        || normalizedPath.startsWith('menu_items/')
        || normalizedPath.startsWith('reviews/')
        || normalizedPath.startsWith('orders/receipts/');
}

function resolveManagedMediaUrl(path) {
    const mediaBase = buildApiMediaBase();

    try {
        const url = new URL(path, window.location.origin);
        const corePath = encodeManagedMediaPath(url.pathname);

        return `${mediaBase}/${corePath}${url.search}${url.hash}`;
    } catch {
        const corePath = encodeManagedMediaPath(path);
        return `${mediaBase}/${corePath}`;
    }
}

export function resolveMediaUrl(path) {
    if (!path || typeof path !== 'string') return '';
    if (path.startsWith('blob:') || path.startsWith('data:')) return path;
    
    // Normalize backslashes to forward slashes for cross-browser compatibility (Safari/Firefox)
    let normalizedPath = path.replace(/\\/g, '/');

    const origin = getApiOrigin();

    // Route any backend-managed upload path through the media endpoint so live deployments
    // do not depend on a public /storage symlink or a matching host/subfolder.
    if (
        normalizedPath.includes('/api/media/')
        || normalizedPath.includes('/storage/')
        || isManagedMediaPath(normalizedPath)
    ) {
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
