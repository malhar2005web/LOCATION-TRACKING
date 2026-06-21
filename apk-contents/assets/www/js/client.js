/**
 * ============================================
 * Client Dashboard Module
 * Background location tracking + UI updates
 * ============================================
 */

// ── State ──
let isTracking = false;
let locationSentCount = 0;
let trackingWatchId = null;
let trackingInterval = null;
let bgGeoConfigured = false;
let isDayStarted = false;
let isCheckedIn = false;

/**
 * Initialize the client dashboard
 * @param {Object} clientData - { clientId, deviceId, name }
 */
function initClientDashboard(clientData) {
    if (!clientData) {
        console.warn('[Client] Missing client data; dashboard init skipped.');
        return;
    }

    // Populate UI
    document.getElementById('client-id-display').textContent = clientData.clientId;
    document.getElementById('client-device-display').textContent = clientData.deviceId;

    // Device info
    if (typeof device !== 'undefined') {
        document.getElementById('client-platform-display').textContent =
            `${device.platform || '--'} ${device.version || ''}`;
        document.getElementById('client-model-display').textContent =
            device.model || device.manufacturer || '--';
    }

    // Reset counter
    locationSentCount = 0;
    document.getElementById('locations-sent-count').textContent = '0';

    // Network listeners
    window.removeEventListener('online', updateNetworkStatus);
    window.removeEventListener('offline', updateNetworkStatus);
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    updateNetworkStatus();
    updateSyncUI();

    // Restore workday state
    isDayStarted = localStorage.getItem('isDayStarted') === 'true';
    isCheckedIn = localStorage.getItem('isCheckedIn') === 'true';

    // Mock reminders count
    const remindersBadge = document.getElementById('badge-reminders-count');
    if (remindersBadge) {
        remindersBadge.textContent = '5';
    }

    // Set Avatar initials
    let initials = 'CL';
    if (clientData.name) {
        const parts = clientData.name.trim().split(/\s+/);
        if (parts.length > 1) {
            initials = (parts[0][0] + parts[1][0]).toUpperCase();
        } else if (parts.length > 0 && parts[0].length > 0) {
            initials = parts[0].slice(0, 2).toUpperCase();
        }
    } else if (clientData.clientId) {
        initials = clientData.clientId.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'CL';
    }
    const avatarEl = document.getElementById('client-avatar-initials');
    if (avatarEl) {
        avatarEl.innerHTML = `<span>${initials}</span>`;
    }

    // Set welcome name
    const welcomeNameEl = document.getElementById('client-welcome-name');
    if (welcomeNameEl) {
        welcomeNameEl.textContent = clientData.name || 'Welcome Client';
    }

    // Update workday buttons/badges and status header pill
    updateWorkdayUI();

    // Start tracking ONLY if workday is already active
    if (isDayStarted) {
        startLocationTracking(clientData.clientId, clientData.deviceId);
    } else {
        setTrackingUI(false);
    }
}

/**
 * Start background location tracking
 * Attempts to use cordova-background-geolocation first,
 * falls back to cordova-plugin-geolocation with setInterval
 */
function startLocationTracking(clientId, deviceId) {
    console.log('[Tracking] Starting location tracking...');

    try {
        // Try Background Geolocation plugin (production-grade)
        if (window.BackgroundGeolocation) {
            startBgGeolocation(clientId, deviceId);
        } else {
            // Fallback to basic geolocation + interval
            console.log('[Tracking] BackgroundGeolocation not available, using fallback');
            startFallbackTracking(clientId, deviceId);
        }
    } catch (err) {
        console.error('[Tracking] Failed to start location tracking:', err);
        showToast('Location tracking could not start. Please allow location permissions.', 'warning', 5000);
        setTrackingUI(false);
        return;
    }

    // Update UI state
    setTrackingUI(true);
}

/**
 * Production-grade background geolocation
 * Uses @transistorsoft/cordova-background-geolocation
 */
function startBgGeolocation(clientId, deviceId) {
    const bgGeo = window.BackgroundGeolocation;

    bgGeo.onLocation(
        (location) => {
            console.log('[BgGeo] Location:', location.coords.latitude, location.coords.longitude);
            handleCapturedLocation(clientId, deviceId, location.coords, location.battery ? location.battery.level : null);
            updateLocationUI(location.coords.latitude, location.coords.longitude);
        },
        (error) => {
            console.error('[BgGeo] Error:', error);
        }
    );

    bgGeo.onMotionChange((event) => {
        console.log('[BgGeo] Motion change:', event.isMoving);
    });

    bgGeo.onHeartbeat((event) => {
        console.log('[BgGeo] Heartbeat');
    });

    // Configure and start
    bgGeo.ready({
        // Geolocation
        desiredAccuracy: bgGeo.DESIRED_ACCURACY_HIGH,
        distanceFilter: 10,
        locationUpdateInterval: 60000,         // 1 minute
        fastestLocationUpdateInterval: 30000,

        // Activity Recognition
        stopTimeout: 5,

        // Application config
        debug: false,
        logLevel: bgGeo.LOG_LEVEL_WARNING,
        stopOnTerminate: false,                 // ← CRITICAL: keep running after app close
        startOnBoot: true,                      // ← CRITICAL: restart on device boot
        enableHeadless: true,                   // ← CRITICAL: run without UI on Android
        foregroundService: true,                // ← CRITICAL: Android requires this

        // Notification (Android foreground service)
        notification: {
            title: 'Location Tracking Active',
            text: 'Location is being tracked every 60 seconds.',
            color: '#3b82f6',
            channelName: 'Location Tracking',
            smallIcon: 'drawable/ic_notification',
            largeIcon: 'drawable/ic_notification',
            priority: bgGeo.NOTIFICATION_PRIORITY_LOW
        },

        // Heartbeat to keep alive
        heartbeatInterval: 60,
        preventSuspend: true,

        // HTTP (optional: direct server posting)
        url: `${API_BASE_URL}/api/location/update`,
        autoSync: true,
        autoSyncThreshold: 5,
        batchSync: false,
        maxBatchSize: 50,
        headers: {
            'Content-Type': 'application/json'
        },
        params: {
            clientId: clientId,
            deviceId: deviceId
        },
        locationTemplate: '{"latitude":<%= latitude %>,"longitude":<%= longitude %>,"timestamp":"<%= timestamp %>","accuracy":<%= accuracy %>,"speed":<%= speed %>,"bearing":<%= heading %>}'

    }).then((state) => {
        bgGeoConfigured = true;
        console.log('[BgGeo] Ready. Tracking:', state.enabled);

        if (!state.enabled) {
            bgGeo.start().then(() => {
                console.log('[BgGeo] Started successfully');
                isTracking = true;
            });
        } else {
            isTracking = true;
        }
    }).catch((err) => {
        console.error('[BgGeo] Ready error:', err);
        // Fallback
        startFallbackTracking(clientId, deviceId);
    });
}

/**
 * Fallback tracking using cordova-plugin-geolocation
 * + cordova-plugin-background-mode
 * Works for development/testing but less reliable in background on Android 10+
 */
function startFallbackTracking(clientId, deviceId) {
    console.log('[Tracking] Starting fallback geolocation...');

    // Enable background mode if available
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.backgroundMode) {
        const bgMode = cordova.plugins.backgroundMode;
        try {
            bgMode.enable();

            bgMode.setDefaults({
                title: 'Location Tracking Active',
                text: 'Location is being tracked every 60 seconds.',
                icon: 'ic_notification',
                color: '#3b82f6',
                resume: true,
                hidden: false,
                silent: false
            });

            bgMode.on('activate', () => {
                console.log('[BgMode] Activated');
                if (typeof bgMode.disableWebViewOptimizations === 'function') {
                    bgMode.disableWebViewOptimizations();
                }
            });
        } catch (err) {
            console.error('[BgMode] Setup failed:', err);
        }

        console.log('[BgMode] Enabled');
    }

    if (!navigator.geolocation || typeof navigator.geolocation.getCurrentPosition !== 'function') {
        console.warn('[Tracking] navigator.geolocation is unavailable.');
        showToast('Location service is unavailable on this device.', 'warning', 5000);
        isTracking = false;
        return;
    }

    // Get location every 60 seconds
    function fetchAndSendLocation() {
        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy, speed, heading } = position.coords;
                console.log('[Fallback] Location:', latitude, longitude);

                handleCapturedLocation(clientId, deviceId, position.coords, null);
                updateLocationUI(latitude, longitude);
            },
            (error) => {
                const message = error && error.message ? error.message : 'Permission denied or GPS unavailable';
                console.error('[Fallback] Geolocation error:', message);
                showToast('GPS error: ' + message, 'warning');
            },
            geoOptions
        );
    }

    // Fetch immediately
    fetchAndSendLocation();

    // Then every 60 seconds
    trackingInterval = setInterval(fetchAndSendLocation, 60000);
    isTracking = true;
}

/**
 * Handle captured location (Save locally, upload attempt, status/notification updates)
 */
async function handleCapturedLocation(clientId, deviceId, coords, battery) {
    const timestamp = new Date().toISOString();

    // 1. Save locally immediately
    const record = StorageService.saveLocation({
        clientId: clientId,
        deviceId: deviceId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        speed: coords.speed,
        bearing: coords.heading || coords.bearing,
        batteryLevel: battery,
        timestamp: timestamp
    });

    updateSyncUI();

    // Check if network is online
    if (!navigator.onLine) {
        console.log('[Tracking] Device is offline, location queued.');
        updateSyncStatusText(`Offline Mode – ${StorageService.getPendingCount()} locations pending sync`);
        return;
    }

    // 2. Attempt API upload
    try {
        const remainingCount = StorageService.getPendingCount();
        const response = await apiRequest('/api/location/update', 'POST', {
            clientId: clientId,
            deviceId: deviceId,
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            speed: coords.speed,
            bearing: coords.heading || coords.bearing || null,
            batteryLevel: battery || null,
            timestamp: timestamp,
            pendingSyncCount: remainingCount
        });

        if (response.success) {
            // 3. Mark as synced
            StorageService.markAsSynced([timestamp]);
            locationSentCount++;
            const countEl = document.getElementById('locations-sent-count');
            if (countEl) countEl.textContent = locationSentCount.toString();

            console.log(`[Tracking] Location #${locationSentCount} uploaded successfully.`);
            showNativeToast("your location is being tracked/sent to admin");

            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            updateSyncStatusText(`Last Location Sent: ${timeStr}`);

            // Automatically sync other pending locations
            syncPendingLocations();
        } else {
            throw new Error(response.message || 'Server rejected request');
        }
    } catch (err) {
        console.error('[Tracking] API update error:', err.message);
        const pendingCount = StorageService.getPendingCount();
        updateSyncStatusText(`Offline Mode – ${pendingCount} locations pending sync`);
    }
}

/**
 * Network connectivity monitoring handlers
 */
function updateNetworkStatus() {
    const isOnline = navigator.onLine;
    const netDisplay = document.getElementById('network-status-display');

    if (isOnline) {
        if (netDisplay) {
            netDisplay.textContent = 'Online';
            netDisplay.style.color = '#10b981';
        }
        console.log('[Network] Connection restored. Triggering sync...');
        syncPendingLocations();
    } else {
        if (netDisplay) {
            netDisplay.textContent = 'Offline';
            netDisplay.style.color = '#ef4444';
        }
        updateSyncStatusText(`Offline Mode – ${StorageService.getPendingCount()} locations pending sync`);
    }
}

function updateSyncUI() {
    const pendingCount = StorageService.getPendingCount();
    const countEl = document.getElementById('pending-locations-count');
    if (countEl) {
        countEl.textContent = pendingCount.toString();
        if (pendingCount > 0) {
            countEl.style.backgroundColor = '#f59e0b';
        } else {
            countEl.style.backgroundColor = '#10b981';
        }
    }

    const lastSyncEl = document.getElementById('last-sync-time-display');
    if (lastSyncEl) {
        const lastSync = StorageService.getLastSyncTime();
        lastSyncEl.textContent = lastSync !== 'Never' ? new Date(lastSync).toLocaleTimeString() : 'Never';
    }
}

function updateSyncStatusText(statusText) {
    const syncDisplay = document.getElementById('sync-status-display');
    if (syncDisplay) {
        syncDisplay.textContent = statusText;
    }
    updateBackgroundNotification(statusText);
}

function updateBackgroundNotification(text) {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.backgroundMode) {
        const bgMode = cordova.plugins.backgroundMode;
        if (bgMode.isActive()) {
            bgMode.configure({
                title: 'Location Tracking Active',
                text: text
            });
        }
    }
}

/**
 * Sync offline pending locations in batch
 */
let isSyncing = false;

async function syncPendingLocations() {
    if (isSyncing) return;

    const pending = StorageService.getPendingLocations();
    if (pending.length === 0) {
        updateSyncUI();
        return;
    }

    if (!navigator.onLine) {
        console.log('[Sync] Network is offline, skipping sync.');
        updateSyncUI();
        return;
    }

    isSyncing = true;
    console.log(`[Sync] Found ${pending.length} pending locations. Syncing...`);
    updateSyncStatusText("Connection Restored – Syncing locations");

    const batchSize = 50;
    let successCount = 0;

    try {
        // Sort chronologically
        pending.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        for (let i = 0; i < pending.length; i += batchSize) {
            const chunk = pending.slice(i, i + batchSize);
            const remainingCount = pending.length - (i + chunk.length);

            const response = await apiRequest('/api/location/batch', 'POST', {
                locations: chunk.map(loc => ({
                    clientId: loc.clientId,
                    deviceId: loc.deviceId,
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    accuracy: loc.accuracy,
                    speed: loc.speed,
                    bearing: loc.bearing,
                    batteryLevel: loc.batteryLevel,
                    timestamp: loc.timestamp
                })),
                pendingSyncCount: remainingCount
            });

            if (response.success) {
                const syncedTimestamps = chunk.map(c => c.timestamp);
                StorageService.markAsSynced(syncedTimestamps);
                successCount += chunk.length;
            } else {
                throw new Error(response.message || 'Batch upload failed');
            }
        }

        console.log(`[Sync] Successfully synced ${successCount} locations.`);
        showNativeToast(`Synced ${successCount} offline locations`);
        
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        updateSyncStatusText(`Last Location Sent: ${timeStr}`);

    } catch (err) {
        console.error('[Sync] Sync failed:', err.message);
        const pendingCount = StorageService.getPendingCount();
        updateSyncStatusText(`Offline Mode – ${pendingCount} locations pending sync`);
    } finally {
        isSyncing = false;
        updateSyncUI();
    }
}

/**
 * Show a native Android system toast
 * Appears at the bottom of the screen, even if the app is in the background
 */
function showNativeToast(message) {
    if (window.plugins && window.plugins.toast) {
        window.plugins.toast.showWithOptions({
            message: message,
            duration: "short",
            position: "bottom"
        });
    } else {
        // Fallback to in-app toast if native is not available (e.g. browser testing)
        showToast(message, 'info');
    }
}

/**
 * Update the client dashboard UI with latest coordinates
 */
function updateLocationUI(lat, lng) {
    const latEl = document.getElementById('current-lat');
    const lngEl = document.getElementById('current-lng');
    const timeEl = document.getElementById('last-update-time');

    if (latEl) latEl.textContent = lat.toFixed(7);
    if (lngEl) lngEl.textContent = lng.toFixed(7);
    if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();
}

/**
 * Toggle tracking on/off
 */
function toggleTracking() {
    const session = getSession();
    if (!session || !session.userData) return;

    if (isTracking) {
        stopLocationTracking();
        setTrackingUI(false);
        showToast('Tracking paused', 'warning');
    } else {
        startLocationTracking(session.userData.clientId, session.userData.deviceId);
        setTrackingUI(true);
        showToast('Tracking resumed', 'success');
    }
}

/**
 * Stop all location tracking
 */
function stopLocationTracking() {
    console.log('[Tracking] Stopping...');

    // Stop background geolocation
    if (window.BackgroundGeolocation && bgGeoConfigured) {
        window.BackgroundGeolocation.stop();
    }

    // Stop fallback interval
    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
    }

    // Stop watch
    if (trackingWatchId !== null) {
        navigator.geolocation.clearWatch(trackingWatchId);
        trackingWatchId = null;
    }

    // Disable background mode
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.backgroundMode) {
        cordova.plugins.backgroundMode.disable();
    }

    isTracking = false;
}

/**
 * Update tracking UI state
 */
function setTrackingUI(active) {
    const card = document.getElementById('tracking-card');
    if (!card) return;

    const dot = card.querySelector('.status-dot');
    const statusText = document.getElementById('tracking-status-text');
    const btnIcon = document.getElementById('tracking-btn-icon');
    const btnText = document.getElementById('tracking-btn-text');
    const toggleBtn = document.getElementById('btn-toggle-tracking');
    const pulseBar = card.querySelector('.pulse-bar-fill');

    if (active) {
        card.className = 'status-card tracking-active';
        if (dot) dot.className = 'status-dot active';
        if (statusText) statusText.textContent = 'Active';
        if (statusText) statusText.className = 'status-value';
        if (btnIcon) btnIcon.textContent = '⏸️';
        if (btnText) btnText.textContent = 'Pause Tracking';
        if (toggleBtn) toggleBtn.className = 'tracking-btn active';
        if (pulseBar) pulseBar.style.animationPlayState = 'running';
    } else {
        card.className = 'status-card tracking-paused';
        if (dot) dot.className = 'status-dot paused';
        if (statusText) statusText.textContent = 'Paused';
        if (statusText) statusText.className = 'status-value paused';
        if (btnIcon) btnIcon.textContent = '▶️';
        if (btnText) btnText.textContent = 'Resume Tracking';
        if (toggleBtn) toggleBtn.className = 'tracking-btn paused';
        if (pulseBar) pulseBar.style.animationPlayState = 'paused';
    }
}

/**
 * Update the workday UI states based on isDayStarted and isCheckedIn
 */
function updateWorkdayUI() {
    const statusIndicator = document.getElementById('client-status-indicator');
    const statusDot = document.getElementById('client-status-dot');
    
    const badgeDayStart = document.getElementById('badge-day-start');
    const badgeCheckIn = document.getElementById('badge-check-in');
    const badgeDayEnd = document.getElementById('badge-day-end');

    // Reset badge classes and content
    if (badgeDayStart) {
        if (isDayStarted) {
            badgeDayStart.className = 'action-card-badge status-active';
            badgeDayStart.textContent = 'Active';
        } else {
            badgeDayStart.className = 'action-card-badge status-inactive';
            badgeDayStart.textContent = 'Pending';
        }
    }
    
    if (badgeCheckIn) {
        if (isCheckedIn) {
            badgeCheckIn.className = 'action-card-badge status-checkedin';
            badgeCheckIn.textContent = 'Checked In';
        } else {
            badgeCheckIn.className = 'action-card-badge status-inactive';
            badgeCheckIn.textContent = 'Pending';
        }
    }
    
    if (badgeDayEnd) {
        badgeDayEnd.className = 'action-card-badge status-inactive';
        badgeDayEnd.textContent = 'Pending';
    }

    // Set active statuses based on workday state
    if (isDayStarted) {
        if (isCheckedIn) {
            if (statusIndicator) {
                statusIndicator.textContent = 'Checked In';
                statusIndicator.style.color = '#a855f7'; // Purple
            }
            if (statusDot) {
                statusDot.className = 'status-dot checked-in';
            }
        } else {
            if (statusIndicator) {
                statusIndicator.textContent = 'Tracking Active';
                statusIndicator.style.color = '#3b82f6'; // Blue
            }
            if (statusDot) {
                statusDot.className = 'status-dot tracking';
            }
        }
    } else {
        if (statusIndicator) {
            statusIndicator.textContent = 'Online';
            statusIndicator.style.color = '#10b981'; // Green
        }
        if (statusDot) {
            statusDot.className = 'status-dot active';
        }
    }
}

/**
 * Handle "Day Start" button action
 */
function handleDayStart() {
    const session = getSession();
    if (!session || !session.userData) return;

    if (isDayStarted) {
        showToast('Workday has already been started.', 'info');
        return;
    }

    isDayStarted = true;
    localStorage.setItem('isDayStarted', 'true');

    // Update UI
    updateWorkdayUI();

    // Start background geolocation tracking
    startLocationTracking(session.userData.clientId, session.userData.deviceId);

    showToast('Workday started successfully. Location tracking is active.', 'success');
}

/**
 * Handle "Check In" button action
 */
function handleCheckIn() {
    if (!isDayStarted) {
        showToast('Please start your workday first by tapping "Day Start".', 'warning');
        return;
    }

    if (isCheckedIn) {
        showToast('You are already checked in for today.', 'info');
        return;
    }

    isCheckedIn = true;
    localStorage.setItem('isCheckedIn', 'true');

    // Update UI
    updateWorkdayUI();

    showToast('Attendance check-in successful.', 'success');
}

/**
 * Handle "Leave Page" button action
 */
function handleLeavePage() {
    showToast('Leave portal opened. No pending actions.', 'info');
}

/**
 * Handle "Reports" button action
 */
function handleReports() {
    showToast('Reports are active. Viewing details in admin view.', 'info');
}

/**
 * Handle "Reminders" button action
 */
function handleReminders() {
    showToast('Today\'s tasks and reminders are up to date.', 'success');
}

/**
 * Handle "Day End" button action
 */
function handleDayEnd() {
    if (!isDayStarted) {
        showToast('Please start your workday first by tapping "Day Start".', 'warning');
        return;
    }

    isDayStarted = false;
    isCheckedIn = false;
    
    localStorage.setItem('isDayStarted', 'false');
    localStorage.setItem('isCheckedIn', 'false');

    // Stop tracking
    stopLocationTracking();
    setTrackingUI(false);

    // Update UI
    updateWorkdayUI();

    showToast('Workday ended. Location tracking is stopped.', 'warning');
}

/**
 * Toggle the Collapsible System Status / Diagnostics Drawer
 */
function toggleDiagnostics() {
    const panel = document.getElementById('diagnostics-drawer-panel');
    const chevron = document.getElementById('chevron-diagnostics');
    
    if (panel) {
        if (panel.classList.contains('expanded')) {
            panel.classList.remove('expanded');
            if (chevron) chevron.classList.remove('rotated');
        } else {
            panel.classList.add('expanded');
            if (chevron) chevron.classList.add('rotated');
        }
    }
}
