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

    // Start tracking
    startLocationTracking(clientData.clientId, clientData.deviceId);
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
            sendLocationToServer(
                clientId,
                deviceId,
                location.coords.latitude,
                location.coords.longitude,
                location.coords.accuracy,
                location.coords.speed,
                location.coords.heading,
                location.battery ? location.battery.level : null
            );
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
            title: 'Location Tracker',
            text: 'Tracking your location in background',
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
                title: 'Location Tracker',
                text: 'Tracking location in background',
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

                sendLocationToServer(clientId, deviceId, latitude, longitude, accuracy, speed, heading, null);
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
 * Send location data to the backend
 */
async function sendLocationToServer(clientId, deviceId, lat, lng, accuracy, speed, bearing, battery) {
    try {
        await apiRequest('/api/location/update', 'POST', {
            clientId: clientId,
            deviceId: deviceId,
            latitude: lat,
            longitude: lng,
            accuracy: accuracy || null,
            speed: speed || null,
            bearing: bearing || null,
            batteryLevel: battery || null,
            timestamp: new Date().toISOString()
        });

        locationSentCount++;
        const countEl = document.getElementById('locations-sent-count');
        if (countEl) countEl.textContent = locationSentCount.toString();

        console.log(`[Tracking] Location #${locationSentCount} sent successfully`);

        // Show native toast (so the user knows their location is sent even when in background)
        showNativeToast("your location is being tracked/sent to admin");

    } catch (err) {
        console.error('[Tracking] Failed to send location:', err.message);
        // Don't show toast for every failed send — too noisy
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
