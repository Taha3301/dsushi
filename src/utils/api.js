const PROD_URL = "https://dsushi-be.onrender.com";
// Use runtime check to be robust against build configuration issues
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE_URL = isLocal ? "" : PROD_URL;

export const API_BASE = API_BASE_URL;

// Proxy is enabled if we are on localhost
export const useProxy = isLocal;

/**
 * Construct an API URL.
 * Uses proxy in dev, authentic backend URL in prod.
 */
export const api = (path) => `${API_BASE_URL}${path}`;

/**
 * Resolve image paths to full URLs.
 * Always points to production backend.
 */
export const resolveImage = (path) => {
    const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%239ca3af">Image</text></svg>';

    if (!path) return FALLBACK_IMAGE;
    if (typeof path === 'string' && /^(http|https):\/\//.test(path)) return path;

    let p = path.toString().trim();

    // Handle ASP.NET wwwroot style paths or similar
    if (p.includes('wwwroot/Images/') || p.includes('wwwroot\\Images\\')) {
        const parts = p.split(/[/\\]/);
        p = `/Images/${parts[parts.length - 1]}`;
    } else if (p.includes('Images/') || p.includes('Images\\')) {
        const match = p.match(/[\/\\]?Images[\/\\](.+)$/i);
        if (match) p = `/Images/${match[1]}`;
    } else {
        if (!p.startsWith('/')) p = `/${p}`;
        // If it looks like a simple image filename, assume it's in /Images/
        if (!/^\/Images\//i.test(p) && /\.(png|jpe?g|gif|webp|svg)$/i.test(p)) {
            p = `/Images/${p.split('/').pop()}`;
        }
    }

    p = p.replace(/\/+/g, '/');

    return `${API_BASE}${p}`;
};
