const PROD_URL = "https://dsushi-be.onrender.com";
// Use runtime check to be robust against build configuration issues
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1' || 
   window.location.hostname.startsWith('192.168.') || 
   window.location.hostname.startsWith('10.') || 
   window.location.hostname.endsWith('.local'));
const API_BASE_URL = isLocal ? "" : PROD_URL;

export const API_BASE = API_BASE_URL; // Base URL configuration

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
export const resolveImage = (path, width = null) => {
    const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%239ca3af">Image</text></svg>';

    if (!path) return FALLBACK_IMAGE;

    let fullUrl = "";
    const p = path.toString().trim();

    // If it's already an absolute URL, use it
    if (/^(http|https):\/\//i.test(p)) {
        fullUrl = p;
    } else {
        // Handle path cleaning as before
        let cleanedPath = p;
        if (cleanedPath.includes('wwwroot/Images/') || cleanedPath.includes('wwwroot\\Images\\')) {
            const parts = cleanedPath.split(/[/\\]/);
            cleanedPath = `/Images/${parts[parts.length - 1]}`;
        } else if (cleanedPath.includes('Images/') || cleanedPath.includes('Images\\')) {
            const match = cleanedPath.match(/[\/\\]?Images[\/\\](.+)$/i);
            if (match) cleanedPath = `/Images/${match[1]}`;
        } else {
            if (!cleanedPath.startsWith('/')) cleanedPath = `/${cleanedPath}`;
            if (!/^\/Images\//i.test(cleanedPath) && /\.(png|jpe?g|gif|webp|svg)$/i.test(cleanedPath)) {
                cleanedPath = `/Images/${cleanedPath.split('/').pop()}`;
            }
        }
        cleanedPath = cleanedPath.replace(/\/+/g, '/');
        fullUrl = `${API_BASE}${cleanedPath}`;
    }

    // Cloudinary Optimization
    if (fullUrl.includes('res.cloudinary.com')) {
        // Standard Cloudinary transformation insertion
        // Replace /upload/ with /upload/c_fill,q_auto,f_auto[,w_{width}]/
        const transformation = width 
            ? `upload/c_fill,w_${width},g_auto,q_auto,f_auto/` 
            : `upload/q_auto,f_auto/`;
            
        return fullUrl.replace('upload/', transformation);
    }

    return fullUrl;
};
