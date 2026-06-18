/**
 * ============================================
 * Admin Dashboard Module
 * Client monitoring + auto-refresh
 * ============================================
 */

// ── State ──
let adminRefreshInterval = null;
let refreshProgressInterval = null;
let refreshCountdown = 60;
let selectedClientId = null;

/**
 * Initialize the admin dashboard
 * @param {Object} adminData - { adminId, name }
 */
function initAdminDashboard(adminData) {
    // Populate header
    document.getElementById('admin-id-display').textContent = adminData.name || adminData.adminId;

    // Load clients immediately
    refreshClients();

    // Auto-refresh every 60 seconds
    startAutoRefresh();
}

/**
 * Fetch and render active clients
 */
async function refreshClients() {
    console.log('[Admin] Refreshing clients list...');

    // Animate refresh icon
    const refreshIcon = document.getElementById('refresh-icon');
    if (refreshIcon) {
        refreshIcon.style.transition = 'transform 0.6s ease';
        refreshIcon.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshIcon.style.transition = 'none';
            refreshIcon.style.transform = 'rotate(0deg)';
        }, 600);
    }

    try {
        const response = await apiRequest('/api/admin/clients', 'GET');

        if (response.success) {
            renderClientsList(response.clients);
            updateAdminStats(response.clients);
        }

    } catch (err) {
        console.error('[Admin] Failed to fetch clients:', err.message);
        showToast('Failed to refresh clients', 'error');
    }

    // Reset countdown
    refreshCountdown = 60;
}

/**
 * Render the clients list
 */
function renderClientsList(clients) {
    const container = document.getElementById('clients-list');

    if (!clients || clients.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>No clients registered yet</p>
            </div>
        `;
        return;
    }

    let html = '';

    clients.forEach(client => {
        const isActive = client.is_active === 1;
        const hasLocation = client.last_latitude !== null && client.last_longitude !== null;
        const lastTime = client.last_location_time
            ? formatTimeAgo(new Date(client.last_location_time))
            : 'Never';
        const coords = hasLocation
            ? `${parseFloat(client.last_latitude).toFixed(5)}, ${parseFloat(client.last_longitude).toFixed(5)}`
            : 'No data';

        // Consider active if location received in last 5 minutes
        const recentlyActive = client.last_location_time &&
            (Date.now() - new Date(client.last_location_time).getTime()) < 5 * 60 * 1000;

        html += `
            <div class="client-card" onclick="viewClientDetail('${client.client_id}')">
                <div class="client-card-status ${recentlyActive ? 'active' : 'inactive'}"></div>
                <div class="client-card-info">
                    <div class="client-card-id">${escapeHtml(client.client_id)}</div>
                    <div class="client-card-device">${escapeHtml(client.device_id)}</div>
                </div>
                <div class="client-card-meta">
                    <div class="client-card-coords">${coords}</div>
                    <div class="client-card-time">${lastTime}</div>
                </div>
                <span class="client-card-arrow">›</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Update admin stats
 */
function updateAdminStats(clients) {
    const total = clients.length;
    const active = clients.filter(c => {
        if (!c.last_location_time) return false;
        return (Date.now() - new Date(c.last_location_time).getTime()) < 5 * 60 * 1000;
    }).length;

    document.getElementById('total-clients-count').textContent = total;
    document.getElementById('active-clients-count').textContent = active;
}

/**
 * Start auto-refresh with progress bar
 */
function startAutoRefresh() {
    // Clear existing
    if (adminRefreshInterval) clearInterval(adminRefreshInterval);
    if (refreshProgressInterval) clearInterval(refreshProgressInterval);

    refreshCountdown = 60;

    // Update progress bar every second
    refreshProgressInterval = setInterval(() => {
        refreshCountdown--;
        const progress = ((60 - refreshCountdown) / 60) * 100;
        const bar = document.getElementById('refresh-progress-bar');
        if (bar) bar.style.width = `${progress}%`;

        if (refreshCountdown <= 0) {
            refreshClients();
            refreshCountdown = 60;
        }
    }, 1000);
}

/**
 * View specific client details
 */
async function viewClientDetail(clientId) {
    selectedClientId = clientId;
    showView('client-detail-view');

    // Show loading state
    document.getElementById('detail-client-id').textContent = clientId;
    document.getElementById('detail-lat').textContent = 'Loading...';
    document.getElementById('detail-lng').textContent = 'Loading...';
    document.getElementById('detail-device-id').textContent = 'Loading...';
    document.getElementById('detail-last-update').textContent = 'Loading...';

    try {
        const response = await apiRequest(`/api/admin/client/${clientId}`, 'GET');

        if (response.success) {
            renderClientDetail(response.client, response.locations);
        }

    } catch (err) {
        console.error('[Admin] Failed to fetch client detail:', err.message);
        showToast('Failed to load client details', 'error');
    }
}

/**
 * Render client detail view
 */
function renderClientDetail(client, locations) {
    // Header
    document.getElementById('detail-client-id').textContent = client.clientId;
    document.getElementById('detail-device-id').textContent = client.deviceId;

    // Status
    const badge = document.getElementById('detail-status-badge');
    if (client.isActive) {
        badge.className = 'status-badge active';
        badge.textContent = '● Active';
    } else {
        badge.className = 'status-badge inactive';
        badge.textContent = '● Inactive';
    }

    // Latest location
    if (locations && locations.length > 0) {
        const latest = locations[0];
        document.getElementById('detail-lat').textContent = parseFloat(latest.latitude).toFixed(7);
        document.getElementById('detail-lng').textContent = parseFloat(latest.longitude).toFixed(7);
        document.getElementById('detail-last-update').textContent =
            new Date(latest.timestamp).toLocaleString();
    } else {
        document.getElementById('detail-lat').textContent = 'No data';
        document.getElementById('detail-lng').textContent = 'No data';
        document.getElementById('detail-last-update').textContent = 'Never';
    }

    // Location history
    renderLocationHistory(locations);
}

/**
 * Render location history list
 */
function renderLocationHistory(locations) {
    const container = document.getElementById('location-history-list');

    if (!locations || locations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>No location data yet</p>
            </div>
        `;
        return;
    }

    let html = '';

    locations.forEach((loc, index) => {
        const time = new Date(loc.timestamp).toLocaleString();
        const lat = parseFloat(loc.latitude).toFixed(6);
        const lng = parseFloat(loc.longitude).toFixed(6);

        html += `
            <div class="history-item">
                <div class="history-dot" style="opacity: ${Math.max(0.3, 1 - (index * 0.02))}"></div>
                <div class="history-info">
                    <div class="history-coords">${lat}, ${lng}</div>
                    <div class="history-time">${time}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Refresh current client detail
 */
function refreshClientDetail() {
    if (selectedClientId) {
        viewClientDetail(selectedClientId);
    }
}

/* ── Utility Functions ── */

/**
 * Format a date as relative time (e.g., "2m ago", "1h ago")
 */
function formatTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
