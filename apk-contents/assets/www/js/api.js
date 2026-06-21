/**
 * ============================================
 * API Helper Module
 * Centralized API communication layer
 * ============================================
 */

// ── Configuration ──
// Change this to your backend server's IP address
// For local development, use your computer's LAN IP
let API_BASE_URL = 'http://173.249.59.181:3005';

// Auto-detect environment to bypass tunnel when running locally in browser
if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    const isCordova = !!window.cordova;
    // If opened via localhost or 127.0.0.1 on your PC, talk directly to local backend (only if not running inside native Cordova app)
    if ((hostname === 'localhost' || hostname === '127.0.0.1') && !isCordova) {
        API_BASE_URL = `http://localhost:${window.location.port === '8081' ? '3001' : '3000'}`;
    } else if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname)) {
        const apiPort = window.location.port === '8081' ? '3001' : '3000';
        API_BASE_URL = `${window.location.protocol}//${hostname}:${apiPort}`;
    }
}

function getApiBaseUrls() {
    const urls = [
        API_BASE_URL,
        'http://173.249.59.181:3005',
        'http://10.50.65.195:3000',
        'http://10.50.65.195:3001',
        'http://192.168.1.8:3001',
        'http://192.168.1.8:3000',
        'http://localhost:3001',
        'http://localhost:3000',
        'https://locationtracker-malhar.loca.lt'
    ];

    return [...new Set(urls)];
}

/**
 * Make an API request with automatic JWT token attachment
 * @param {string} endpoint - API endpoint (e.g., '/api/client/login')
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object|null} body - Request body for POST/PUT
 * @returns {Promise<Object>} Parsed JSON response
 */
async function apiRequest(endpoint, method = 'GET', body = null) {
    let lastNetworkError = null;
    const urls = getApiBaseUrls();

    for (const baseUrl of urls) {
        try {
            return await apiRequestOnce(baseUrl, endpoint, method, body);
        } catch (err) {
            if (err instanceof ApiError && err.status !== 0) {
                throw err;
            }

            lastNetworkError = err;
            console.error(`[API] Network failure for ${baseUrl}${endpoint}:`, err);
        }
    }

    throw new ApiError(
        `Cannot connect to server (${urls.join(', ')}). Check Wi-Fi/firewall.`,
        0,
        lastNetworkError
    );
}

async function apiRequestOnce(baseUrl, endpoint, method = 'GET', body = null) {
    const url = `${baseUrl}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true' // Bypasses localtunnel landing page reminder
    };

    // Attach JWT token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method: method,
        headers: headers
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const rawText = await response.text();
        let data = null;

        try {
            data = rawText ? JSON.parse(rawText) : {};
        } catch (parseErr) {
            throw new ApiError(
                `Server returned non-JSON response from ${baseUrl}: ${rawText.slice(0, 120)}`,
                response.status,
                rawText
            );
        }

        if (!response.ok) {
            // Handle 401 (token expired)
            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user_role');
                localStorage.removeItem('user_data');
                showToast('Session expired. Please login again.', 'warning');
                showView('login-view');
            }
            throw new ApiError(data.message || `Request failed (${response.status})`, response.status, data);
        }

        return data;

    } catch (err) {
        if (err instanceof ApiError) {
            throw err;
        }

        console.error('API Network Error:', err);
        throw new ApiError(err.message || 'Network request failed', 0, err);
    }
}

/**
 * Custom API Error class
 */
class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

/**
 * Show a toast notification
 * @param {string} message - Toast message
 * @param {string} type - 'success' | 'error' | 'info' | 'warning'
 * @param {number} duration - Duration in ms (default 3000)
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };

    toast.innerHTML = `<span>${icons[type] || ''}</span> ${message}`;
    container.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Save auth session to localStorage
 */
function saveSession(token, role, userData) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_data', JSON.stringify(userData));
}

/**
 * Get saved session
 */
function getSession() {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    const userData = localStorage.getItem('user_data');

    if (!token || !role) return null;

    try {
        return {
            token,
            role,
            userData: userData ? JSON.parse(userData) : null
        };
    } catch (err) {
        console.error('[Auth] Stored session is invalid:', err);
        clearSession();
        return null;
    }
}

/**
 * Clear auth session
 */
function clearSession() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_data');
}
