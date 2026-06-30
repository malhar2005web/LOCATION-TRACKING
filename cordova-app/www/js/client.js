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
let clientName = 'Client';

// ── Theme management ──
function initTheme() {
    try {
        const theme = localStorage.getItem('theme-preference');
        const hour = new Date().getHours();
        const isNight = (hour >= 21 || hour < 5);
        
        if (theme === 'dark' || (!theme && isNight)) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
        }
        updateThemeToggleUI();
    } catch(e) {
        console.error('[Theme] Failed to init theme:', e);
    }
}

function toggleThemeMode() {
    try {
        const isDark = document.documentElement.classList.contains('dark-mode');
        if (isDark) {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme-preference', 'light');
        } else {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme-preference', 'dark');
        }
        updateThemeToggleUI();
    } catch(e) {
        console.error('[Theme] Failed to toggle theme:', e);
    }
}

function updateThemeToggleUI() {
    try {
        const isDark = document.documentElement.classList.contains('dark-mode');
        const labelEl = document.getElementById('current-theme-label');
        if (labelEl) {
            labelEl.textContent = isDark ? 'Dark' : 'Light';
        }
    } catch(e) {
        console.error('[Theme] Failed to update toggle UI:', e);
    }
}

// ── Greeting management ──
function updateGreeting() {
    try {
        const greetingEl = document.getElementById('client-welcome-greeting');
        if (!greetingEl) return;
        
        const hour = new Date().getHours();
        let greeting = '';
        if (hour >= 5 && hour < 12) {
            greeting = 'Good Morning,';
        } else if (hour >= 12 && hour < 17) {
            greeting = 'Good Afternoon,';
        } else if (hour >= 17 && hour < 21) {
            greeting = 'Good Evening,';
        } else {
            greeting = 'Good Night,';
        }
        greetingEl.textContent = greeting;
    } catch(e) {
        console.error('[Greeting] Failed to update greeting:', e);
    }
}

/**
 * Initialize the client dashboard
 * @param {Object} clientData - { clientId, deviceId, name }
 */
function initClientDashboard(clientData) {
    if (!clientData) {
        console.warn('[Client] Missing client data; dashboard init skipped.');
        return;
    }

    clientName = clientData.name || 'Client';

    // Populate UI
    const clientIdEl = document.getElementById('client-id-display');
    if (clientIdEl) {
        clientIdEl.textContent = 'Employee ID: ' + (clientData.clientId || '11');
    }
    const deviceDisplay = document.getElementById('client-device-display');
    if (deviceDisplay) {
        deviceDisplay.textContent = clientData.deviceId;
    }
    const deviceBadge = document.getElementById('client-device-display-badge');
    if (deviceBadge) {
        deviceBadge.textContent = clientData.deviceId;
    }

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

    // Initialize Reminders database and refresh count
    populateTimeSelectors();
    ReminderDb.init(() => {
        refreshRemindersCount();
        syncReminders();
    });
    LeaveDb.init(() => {
        syncLeaves();
    });
    if (typeof DsrDb !== 'undefined') {
        DsrDb.init(() => {
            syncDSRs();
        });
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
    const welcomeNameBannerEl = document.getElementById('client-welcome-name-banner');
    if (welcomeNameBannerEl) {
        welcomeNameBannerEl.textContent = clientData.name || 'Welcome Client';
    }
    const submenuNames = document.querySelectorAll('.submenu-client-name');
    submenuNames.forEach(el => {
        el.textContent = clientData.name ? `Welcome ${clientData.name}` : 'Welcome Client';
    });

    // Update workday buttons/badges and status header pill
    updateWorkdayUI();
    updateMetricsUI();
    
    // Update theme and greetings
    initTheme();
    updateGreeting();
    updateThemeToggleUI();

    // Start tracking ONLY if workday is already active
    if (isDayStarted) {
        startLocationTracking(clientData.clientId, clientData.deviceId);
        if (!window.durationInterval) {
            window.durationInterval = setInterval(updateMetricsUI, 10000);
        }
    } else {
        setTrackingUI(false);
    }

    // Bind progress bar listeners for new client registration form
    bindNewClientProgressListeners();
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

    // Call third-party tracking API directly as the primary upload channel
    try {
        console.log('[Tracking] Sending location to third-party Skyway API...');
        const numericUserId = parseInt(clientId, 10);
        const useruniqeid = isNaN(numericUserId) ? clientId : numericUserId;

        const response = await fetch(`${API_BASE_URL}/receiveddata`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                useruniqeid: useruniqeid,
                imeino: deviceId,
                deviceid: "GPS FIX",
                gpsLatitude: coords.latitude.toString(),
                gpsLongitude: coords.longitude.toString(),
                gpsAccuracy: coords.accuracy.toString(),
                gpsSpeed: (coords.speed || 0).toString(),
                gpsTimestamp: new Date(timestamp).toISOString().replace('T', ' ').slice(0, 16),
                calbaering: Math.round(coords.heading || coords.bearing || 0)
            })
        });

        const rawText = await response.text();
        let rData = null;
        try {
            rData = JSON.parse(rawText);
        } catch (e) {
            rData = { status: rawText.trim() };
        }
        console.log('[Tracking] Skyway tracking response:', rData);

        const statusOk = (rData && rData.trackerid && rData.trackerid[0] && rData.trackerid[0].status === 'ok') ||
                         (rData && rData.status === 'ok') ||
                         rawText.toLowerCase().includes('ok');

        if (statusOk) {
            // Mark as synced locally
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
            throw new Error(rData?.status || 'Skyway server rejected location');
        }
    } catch (skywayErr) {
        console.error('[Tracking] Skyway tracking failed:', skywayErr.message);
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
    const netBadge = document.getElementById('network-status-display-badge');

    if (isOnline) {
        if (netDisplay) {
            netDisplay.textContent = 'Online';
            netDisplay.style.color = '#10b981';
        }
        if (netBadge) {
            netBadge.textContent = 'Connected';
            netBadge.style.backgroundColor = '#DDF3E2';
            netBadge.style.color = '#8ABF9A';
        }
        console.log('[Network] Connection restored. Triggering sync...');
        syncPendingLocations();
        syncReminders();
        syncLeaves();
        if (typeof syncDSRs === 'function') {
            syncDSRs();
        }
    } else {
        if (netDisplay) {
            netDisplay.textContent = 'Offline';
            netDisplay.style.color = '#ef4444';
        }
        if (netBadge) {
            netBadge.textContent = 'Disconnected';
            netBadge.style.backgroundColor = '#FFE6D5';
            netBadge.style.color = '#F28C52';
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
    const lastSyncBadge = document.getElementById('last-sync-time-display-badge');
    const lastSync = StorageService.getLastSyncTime();
    const formattedSyncTime = lastSync !== 'Never' ? new Date(lastSync).toLocaleTimeString() : 'Never';
    
    if (lastSyncEl) {
        lastSyncEl.textContent = formattedSyncTime;
    }
    if (lastSyncBadge) {
        lastSyncBadge.textContent = formattedSyncTime;
    }

    const syncBadge = document.getElementById('sync-status-display-badge');
    if (syncBadge) {
        if (pendingCount > 0) {
            syncBadge.textContent = 'Pending Sync';
            syncBadge.style.backgroundColor = '#FFF9E6';
            syncBadge.style.color = '#F4D06F';
        } else {
            syncBadge.textContent = 'Synced';
            syncBadge.style.backgroundColor = '#DDF3E2';
            syncBadge.style.color = '#8ABF9A';
        }
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

    let successCount = 0;

    try {
        // Sort chronologically
        pending.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        for (const loc of pending) {
            const numericUserId = parseInt(loc.clientId, 10);
            const useruniqeid = isNaN(numericUserId) ? loc.clientId : numericUserId;

            try {
                const response = await fetch(`${API_BASE_URL}/receiveddata`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        useruniqeid: useruniqeid,
                        imeino: loc.deviceId,
                        deviceid: "GPS FIX",
                        gpsLatitude: loc.latitude.toString(),
                        gpsLongitude: loc.longitude.toString(),
                        gpsAccuracy: (loc.accuracy || 0).toString(),
                        gpsSpeed: (loc.speed || 0).toString(),
                        gpsTimestamp: new Date(loc.timestamp).toISOString().replace('T', ' ').slice(0, 16),
                        calbaering: Math.round(loc.bearing || 0)
                      })
                });

                const rawText = await response.text();
                let rData = null;
                try {
                    rData = JSON.parse(rawText);
                } catch (e) {
                    rData = { status: rawText.trim() };
                }

                const statusOk = (rData && rData.trackerid && rData.trackerid[0] && rData.trackerid[0].status === 'ok') ||
                                 (rData && rData.status === 'ok') ||
                                 rawText.toLowerCase().includes('ok');

                if (statusOk) {
                    StorageService.markAsSynced([loc.timestamp]);
                    successCount++;
                } else {
                    console.warn(`[Sync] Failed to sync location timestamp ${loc.timestamp}:`, rData);
                }
            } catch (locErr) {
                console.error(`[Sync] Error syncing location timestamp ${loc.timestamp}:`, locErr.message);
                break; // Exit the loop on network error to prevent endless failures
            }
        }

        if (successCount > 0) {
            console.log(`[Sync] Successfully synced ${successCount} locations.`);
            showNativeToast(`Synced ${successCount} offline locations`);
            
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            updateSyncStatusText(`Last Location Sent: ${timeStr}`);
        }

    } catch (err) {
        console.error('[Sync] Sync failed:', err.message);
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
        if (btnIcon) btnIcon.textContent = 'Pause';
        if (btnText) btnText.textContent = 'Pause Tracking';
        if (toggleBtn) toggleBtn.className = 'tracking-btn active';
        if (pulseBar) pulseBar.style.animationPlayState = 'running';
    } else {
        card.className = 'status-card tracking-paused';
        if (dot) dot.className = 'status-dot paused';
        if (statusText) statusText.textContent = 'Paused';
        if (statusText) statusText.className = 'status-value paused';
        if (btnIcon) btnIcon.textContent = 'Resume';
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

    // Submenu status indicators
    const checkinDot = document.querySelector('#checkin-view .status-dot');
    const checkinIndicator = document.getElementById('checkin-status-indicator');
    const leaveDot = document.getElementById('leave-status-dot');
    const leaveIndicator = document.getElementById('leave-status-indicator');
    const reportsDot = document.getElementById('reports-status-dot');
    const reportsIndicator = document.getElementById('reports-status-indicator');
    const othersDot = document.getElementById('others-status-dot');
    const othersIndicator = document.getElementById('others-status-indicator');

    // Reset badge classes and content
    if (badgeDayStart) {
        if (isDayStarted) {
            badgeDayStart.className = 'card-premium-status-pill status-active';
            badgeDayStart.textContent = 'Active';
        } else {
            badgeDayStart.className = 'card-premium-status-pill status-inactive';
            badgeDayStart.textContent = 'Pending';
        }
    }
    
    if (badgeCheckIn) {
        if (isCheckedIn) {
            badgeCheckIn.className = 'card-premium-status-pill status-checkedin';
            badgeCheckIn.textContent = 'Checked In';
        } else {
            badgeCheckIn.className = 'card-premium-status-pill status-inactive';
            badgeCheckIn.textContent = 'Pending';
        }
    }

    // Set active statuses based on workday state
    let statusText = 'Online';
    let statusColor = '#8ABF9A'; // Success Green
    let statusClass = 'status-dot active';

    if (isDayStarted) {
        if (isCheckedIn) {
            statusText = 'Checked In';
            statusColor = '#8ABF9A'; // Success Green
            statusClass = 'status-dot checked-in';
        } else {
            statusText = 'Tracking Active';
            statusColor = '#8ABF9A'; // Success Green
            statusClass = 'status-dot tracking';
        }
    }

    // Apply to client dashboard
    if (statusIndicator) {
        statusIndicator.textContent = statusText;
        statusIndicator.style.color = statusColor;
    }
    if (statusDot) {
        statusDot.className = statusClass;
    }

    // Apply to submenu screens
    if (checkinIndicator) {
        checkinIndicator.textContent = statusText;
        checkinIndicator.style.color = statusColor;
    }
    if (checkinDot) {
        checkinDot.className = statusClass;
    }

    if (leaveIndicator) {
        leaveIndicator.textContent = statusText;
        leaveIndicator.style.color = statusColor;
    }
    if (leaveDot) {
        leaveDot.className = statusClass;
    }

    const leaveAppIndicator = document.getElementById('leave-app-status-indicator');
    const leaveAppDot = document.getElementById('leave-app-status-dot');
    if (leaveAppIndicator) {
        leaveAppIndicator.textContent = statusText;
        leaveAppIndicator.style.color = statusColor;
    }
    if (leaveAppDot) {
        leaveAppDot.className = statusClass;
    }

    const leaveStatusIndicator = document.getElementById('leave-status-status-indicator');
    const leaveStatusDot = document.getElementById('leave-status-status-dot');
    if (leaveStatusIndicator) {
        leaveStatusIndicator.textContent = statusText;
        leaveStatusIndicator.style.color = statusColor;
    }
    if (leaveStatusDot) {
        leaveStatusDot.className = statusClass;
    }

    if (reportsIndicator) {
        reportsIndicator.textContent = statusText;
        reportsIndicator.style.color = statusColor;
    }
    if (reportsDot) {
        reportsDot.className = statusClass;
    }

    if (othersIndicator) {
        othersIndicator.textContent = statusText;
        othersIndicator.style.color = statusColor;
    }
    if (othersDot) {
        othersDot.className = statusClass;
    }
}

/**
 * Handle "Day Start" button action
 */
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
    localStorage.setItem('visitsToday', '0');
    localStorage.setItem('dsrUpdatesToday', '0');
    localStorage.setItem('dayStartTime', Date.now().toString());

    // Update UI
    updateWorkdayUI();
    updateMetricsUI();
    if (!window.durationInterval) {
        window.durationInterval = setInterval(updateMetricsUI, 10000);
    }

    // Start background geolocation tracking
    startLocationTracking(session.userData.clientId, session.userData.deviceId);

    // Call Skyway APIs if online
    if (navigator.onLine) {
        let latVal = 0.0;
        let lngVal = 0.0;
        const curLatEl = document.getElementById('current-lat');
        const curLngEl = document.getElementById('current-lng');
        if (curLatEl && curLngEl) {
            const latText = curLatEl.textContent.trim();
            const lngText = curLngEl.textContent.trim();
            if (latText !== '--' && lngText !== '--') {
                latVal = parseFloat(latText);
                lngVal = parseFloat(lngText);
            }
        }

        const currentDate = new Date().toISOString().replace('T', ' ').slice(0, 19);
        const empid = (session.userData.name) || 'demo admin2';
        const imeino = session.userData.deviceId || '';

        // Call startendday
        fetch('https://fleettrackon.co.in/skywaydia/startendday', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gcdatetime: currentDate.slice(0, 16), // YYYY-MM-DD HH:MM
                glaststatus: "START",
                empid: empid,
                imeino: imeino,
                gpsLatitude: latVal,
                gpsLongitude: lngVal
            })
        }).catch(err => console.error('startendday START error:', err));

        // Call iamatevent
        fetch('https://fleettrackon.co.in/skywaydia/iamatevent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gotiamatdate: currentDate,
                gotempname: empid,
                gotempid: session.userData.clientId || imeino,
                gotinoutstatus: "START",
                gotiamatclient: "",
                gotiamatlat: latVal,
                gotiamatlong: lngVal,
                gimeinumber: imeino
            })
        }).catch(err => console.error('iamatevent START error:', err));

        // Sync start day event locally
        apiRequest('/api/client/day-start', 'POST', {
            start_time: currentDate,
            start_lat: latVal,
            start_lng: lngVal,
            client_name: empid
        }).catch(err => console.error('[API] Local day-start error:', err));
    }

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

    const session = getSession();

    if (!isCheckedIn) {
        isCheckedIn = true;
        localStorage.setItem('isCheckedIn', 'true');
        updateWorkdayUI();
        showToast('Attendance check-in successful.', 'success');

        // Call iamatevent if online
        if (navigator.onLine && session && session.userData) {
            const currentDate = new Date().toISOString().replace('T', ' ').slice(0, 19);
            const empid = (session.userData.name) || 'demo admin2';
            const imeino = session.userData.deviceId || '';
            let latVal = 0.0;
            let lngVal = 0.0;
            const curLatEl = document.getElementById('current-lat');
            const curLngEl = document.getElementById('current-lng');
            if (curLatEl && curLngEl) {
                const latText = curLatEl.textContent.trim();
                const lngText = curLngEl.textContent.trim();
                if (latText !== '--' && lngText !== '--') {
                    latVal = parseFloat(latText);
                    lngVal = parseFloat(lngText);
                }
            }

            fetch('https://fleettrackon.co.in/skywaydia/iamatevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gotiamatdate: currentDate,
                    gotempname: empid,
                    gotempid: session.userData.clientId || imeino,
                    gotinoutstatus: "CHECKIN",
                    gotiamatclient: "",
                    gotiamatlat: latVal,
                    gotiamatlong: lngVal,
                    gimeinumber: imeino
                })
            }).catch(err => console.error('iamatevent CHECKIN error:', err));
        }
    }

    showView('checkin-view');
}

/**
 * Handle "Leave Page" button action
 */
function handleLeavePage() {
    showView('leave-view');
}

/**
 * Handle "Reports" button action
 */
function handleReports() {
    showView('reports-view');
}

/**
 * Submenu Action Card Click Event Handlers
 */
/**
 * Submenu Action Card Click Event Handlers
 */
function handleUpdateDSR() {
    showView('dsr-client-list-view');
    fetchClientList();
}

function handleNewClient() {
    // Reset and initialize New Client Form
    resetNewClientForm();
    populateNewClientTimeSelectors();
    showView('new-client-view');
    toggleAccordionSection(1);
    updateRegistrationProgress();
    
    // Auto-detect location for GPS values
    const curLatEl = document.getElementById('current-lat');
    const curLngEl = document.getElementById('current-lng');
    const newClientLat = document.getElementById('new-client-lat');
    const newClientLng = document.getElementById('new-client-lng');
    if (curLatEl && curLngEl && newClientLat && newClientLng) {
        newClientLat.value = curLatEl.textContent.trim() !== '--' ? curLatEl.textContent.trim() : '0.0';
        newClientLng.value = curLngEl.textContent.trim() !== '--' ? curLngEl.textContent.trim() : '0.0';
    }
}

function handleOthersCheckIn() {
    resetOthersForm();
    populateOthersTimeSelectors();
    showView('others-view');
}

function resetOthersForm() {
    const fields = [
        'others-customer-name', 'others-office-address', 'others-site-details',
        'others-contact-person', 'others-contact-number', 'others-today-status',
        'others-remark', 'others-followup-date', 'others-followup-hours', 'others-followup-minutes'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (el.tagName === 'SELECT') {
                el.selectedIndex = 0;
            } else {
                el.value = '';
            }
        }
    });

    const nameEl = document.getElementById('others-customer-name');
    if (nameEl) {
        nameEl.value = 'Others';
    }

    const today = new Date().toISOString().split('T')[0];
    const dateEl = document.getElementById('others-followup-date');
    if (dateEl) dateEl.value = today;

    const hourEl = document.getElementById('others-followup-hours');
    if (hourEl) hourEl.value = '00';
    const minEl = document.getElementById('others-followup-minutes');
    if (minEl) minEl.value = '00';
}

function populateOthersTimeSelectors() {
    const hoursHtml = Array.from({length: 24}, (_, i) => {
        const val = i.toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
    }).join('');
    
    const minutesHtml = Array.from({length: 60}, (_, i) => {
        const val = i.toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
    }).join('');
    
    const bh = document.getElementById('others-followup-hours');
    const bm = document.getElementById('others-followup-minutes');
    if (bh) bh.innerHTML = hoursHtml;
    if (bm) bm.innerHTML = minutesHtml;
}

async function submitOthers() {
    if (!isDayStarted) {
        showToast('Please start your workday first by tapping "Day Start".', 'warning');
        return;
    }

    const customerName = document.getElementById('others-customer-name').value.trim();
    const officeAddress = document.getElementById('others-office-address').value.trim();
    const siteDetails = document.getElementById('others-site-details').value.trim();
    const contactPerson = document.getElementById('others-contact-person').value.trim();
    const contactNumber = document.getElementById('others-contact-number').value.trim();
    const todayStatus = document.getElementById('others-today-status').value;
    const remark = document.getElementById('others-remark').value.trim();
    const followupDate = document.getElementById('others-followup-date').value;
    const hours = document.getElementById('others-followup-hours').value;
    const minutes = document.getElementById('others-followup-minutes').value;

    if (!customerName) {
        showToast('Customer Name is required.', 'error');
        document.getElementById('others-customer-name').focus();
        return;
    }

    if (!todayStatus) {
        showToast("Today's Status is required.", 'error');
        document.getElementById('others-today-status').focus();
        return;
    }

    const session = getSession();
    const userid = (session && session.userData && session.userData.clientId) || '';
    const gemptype = (session && session.role) || 'client';
    const gempname = (session && session.userData && session.userData.name) || '';
    const currentDateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const dsrBody = {
        userid: userid,
        gemptype: gemptype,
        currentdatetime: currentDateTime,
        intime: "00:00:00",
        outtime: "00:00:00",
        outletname: customerName,
        nleadname: customerName,
        ncontact: contactNumber,
        nremark: remark,
        nfollowup: followupDate || "",
        nfollowuptime: followupDate ? (hours + ":" + minutes) : "",
        assignedemp: "All",
        gpsLatitude: "0.0",
        gpsLongitude: "0.0",
        l_nremark: remark,
        n_nremark: remark,
        leaddatetime: currentDateTime,
        officeaddres: officeAddress,
        contactperson: contactPerson,
        gempname: gempname,
        follow_rem: remark,
        lleadno: ""
    };

    const curLatEl = document.getElementById('current-lat');
    const curLngEl = document.getElementById('current-lng');
    if (curLatEl && curLngEl) {
        const latVal = curLatEl.textContent.trim();
        const lngVal = curLngEl.textContent.trim();
        if (latVal !== '--' && lngVal !== '--') {
            dsrBody.gpsLatitude = latVal;
            dsrBody.gpsLongitude = lngVal;
        }
    }

    showToast('Submitting activity details...', 'info');

    if (navigator.onLine) {
        try {
            console.log('[Others] Submitting to third-party API...');
            await fetch('https://fleettrackon.co.in/skywaydia/updateleaddeatils_sky', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dsrBody)
            });
            console.log('[Others] Third-party API registration success.');
        } catch (e) {
            console.error('[Others] Third-party API failed:', e);
        }

        try {
            await fetch('https://fleettrackon.co.in/skywaydia/iamatevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gotiamatdate: currentDateTime,
                    gotempname: gempname,
                    gotempid: userid,
                    gotinoutstatus: "DSR_UPDATE",
                    gotiamatclient: customerName,
                    gotiamatlat: parseFloat(dsrBody.gpsLatitude),
                    gotiamatlong: parseFloat(dsrBody.gpsLongitude),
                    gimeinumber: (session && session.userData && session.userData.deviceId) || ""
                })
            });
        } catch (e) {}
    } else {
        showToast('Offline Mode: Activity saved locally.', 'info');
    }

    // Save DSR record locally (offline-first)
    if (typeof DsrDb !== 'undefined') {
        const localDsr = {
            client_id: userid,
            client_name: gempname,
            customer_name: customerName,
            office_address: officeAddress,
            site_name: siteDetails,
            contact_person: contactPerson,
            contact_no: contactNumber,
            last_remark: remark,
            visited_for: todayStatus,
            followup: followupDate ? `${followupDate} ${hours}:${minutes}:00` : null,
            latitude: parseFloat(dsrBody.gpsLatitude) || 0.0,
            longitude: parseFloat(dsrBody.gpsLongitude) || 0.0,
            sync_status: 'Pending',
            created_timestamp: new Date().toISOString()
        };

        DsrDb.saveDsr(localDsr, (saved) => {
            console.log('[Others] DSR saved locally:', saved);
            syncDSRs();
        });
    }

    if (todayStatus && followupDate && hours && minutes) {
        let reminderType = 'General Reminder';
        if (todayStatus === 'Follow Up') reminderType = 'Follow Up';
        else if (todayStatus === 'Document Submission') reminderType = 'Document Submission';
        else if (todayStatus === 'Bill Submission') reminderType = 'Bill Submission';
        else if (todayStatus === 'Payment Collection') reminderType = 'Payment Collection';
        else if (todayStatus === 'Document Collection') reminderType = 'Document Collection';

        const reminderTime = hours + ":" + minutes;
        const remId = 'REM_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const newReminder = {
            id: remId,
            client_name: customerName,
            contact_person: contactPerson,
            contact_number: contactNumber,
            reminder_type: reminderType,
            reminder_date: followupDate,
            reminder_time: reminderTime,
            remark: remark,
            source_module: 'Others',
            created_timestamp: new Date().toISOString(),
            updated_timestamp: new Date().toISOString(),
            status: 'Pending',
            sync_status: 'Pending'
        };

        ReminderDb.saveReminder(newReminder, (saved) => {
            console.log('[Others] Reminder created locally:', saved);

            const dateParts = followupDate.split('-');
            const dateObj = new Date(
                parseInt(dateParts[0], 10),
                parseInt(dateParts[1], 10) - 1,
                parseInt(dateParts[2], 10),
                parseInt(hours, 10),
                parseInt(minutes, 10),
                0
            );

            if (window.AlarmBridge && typeof window.AlarmBridge.scheduleReminderNotification === 'function') {
                window.AlarmBridge.scheduleReminderNotification(
                    remId, customerName, reminderType, remark, reminderTime, dateObj.getTime()
                );
            }

            refreshRemindersCount();
            syncReminders();
        });
    }

    const currentDsrs = parseInt(localStorage.getItem('dsrUpdatesToday') || '0', 10) + 1;
    const currentVisits = parseInt(localStorage.getItem('visitsToday') || '0', 10) + 1;
    localStorage.setItem('dsrUpdatesToday', currentDsrs.toString());
    localStorage.setItem('visitsToday', currentVisits.toString());
    updateMetricsUI();

    showToast('Activity submitted successfully!', 'success');
    showView('checkin-view');
}

function handleLeaveApplication() {
    resetLeaveForm();
    showView('leave-application-view');
}

function handleLeaveStatus() {
    leaveStatusSource = 'client';
    showView('leave-status-view');
    fetchLeaveHistory();
}

function resetLeaveForm() {
    document.getElementById('leave-type').value = '';
    document.getElementById('leave-full-half').value = '';
    document.getElementById('leave-from-date').value = '';
    document.getElementById('leave-till-date').value = '';
    document.getElementById('leave-reason').value = '';
    document.getElementById('leave-absence-person').value = '';
    document.getElementById('leave-total-display').textContent = '0.0 Days';
    document.getElementById('leave-total-display').style.color = '#10b981';
    
    const summaryCard = document.getElementById('leave-summary-card');
    if (summaryCard) summaryCard.classList.add('hidden');
}

function calculateTotalLeaveDays() {
    const type = document.getElementById('leave-type').value;
    const fullHalf = document.getElementById('leave-full-half').value;
    const fromDateVal = document.getElementById('leave-from-date').value;
    const tillDateVal = document.getElementById('leave-till-date').value;
    const displayEl = document.getElementById('leave-total-display');
    const summaryCard = document.getElementById('leave-summary-card');
    const summaryType = document.getElementById('summary-leave-type');
    const summaryDuration = document.getElementById('summary-leave-duration');
    const summaryDays = document.getElementById('summary-leave-days');

    if (!fromDateVal || !tillDateVal) {
        if (displayEl) {
            displayEl.textContent = '0.0 Days';
            displayEl.style.color = '#10b981';
        }
        if (summaryCard) summaryCard.classList.add('hidden');
        return 0;
    }

    const fromDate = new Date(fromDateVal);
    const tillDate = new Date(tillDateVal);

    if (tillDate < fromDate) {
        if (displayEl) {
            displayEl.textContent = 'Invalid Dates';
            displayEl.style.color = 'var(--color-red)';
        }
        if (summaryCard) summaryCard.classList.add('hidden');
        return 0;
    }

    const diffTime = tillDate.getTime() - fromDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let total = diffDays;
    if (fullHalf === 'Half Day') {
        total = diffDays * 0.5;
    }

    if (displayEl) {
        displayEl.textContent = total.toFixed(1) + ' Days';
        displayEl.style.color = '#10b981';
    }

    // Update Summary Card
    if (summaryCard && type && fullHalf) {
        summaryCard.classList.remove('hidden');
        if (summaryType) summaryType.textContent = type + ' (' + fullHalf + ')';
        if (summaryDuration) summaryDuration.textContent = fromDateVal + ' to ' + tillDateVal;
        if (summaryDays) summaryDays.textContent = total.toFixed(1) + ' Days';
    } else {
        if (summaryCard) summaryCard.classList.add('hidden');
    }

    return total;
}

function submitLeave() {
    const type = document.getElementById('leave-type').value;
    const fullHalf = document.getElementById('leave-full-half').value;
    const fromDateVal = document.getElementById('leave-from-date').value;
    const tillDateVal = document.getElementById('leave-till-date').value;
    const reason = document.getElementById('leave-reason').value.trim();
    const absence = document.getElementById('leave-absence-person').value.trim();

    if (!type) {
        showToast('Please select a leave type.', 'warning');
        document.getElementById('leave-type').focus();
        return;
    }
    if (!fullHalf) {
        showToast('Please select Full/Half Day.', 'warning');
        document.getElementById('leave-full-half').focus();
        return;
    }
    if (!fromDateVal) {
        showToast('Please select Leave Required From Date.', 'warning');
        document.getElementById('leave-from-date').focus();
        return;
    }
    if (!tillDateVal) {
        showToast('Please select Leave Required Till Date.', 'warning');
        document.getElementById('leave-till-date').focus();
        return;
    }
    if (new Date(tillDateVal) < new Date(fromDateVal)) {
        showToast('Till Date cannot be earlier than From Date.', 'warning');
        document.getElementById('leave-till-date').focus();
        return;
    }
    if (!reason) {
        showToast('Please provide a reason for leave.', 'warning');
        document.getElementById('leave-reason').focus();
        return;
    }
    if (!absence) {
        showToast('Please specify the In Absence Responsible Person.', 'warning');
        document.getElementById('leave-absence-person').focus();
        return;
    }

    const session = getSession();
    const clientId = (session && session.userData && session.userData.clientId) || '';
    const empName = (session && session.userData && session.userData.name) || 'Client';

    const totalDays = calculateTotalLeaveDays();

    const leave = {
        id: 'LV-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        client_id: clientId,
        employee_name: empName,
        leave_type: type,
        full_half_day: fullHalf,
        start_date: fromDateVal,
        end_date: tillDateVal,
        total_days: totalDays,
        reason: reason,
        in_absence: absence,
        status: 'Pending',
        sync_status: 'Pending',
        created_timestamp: new Date().toISOString(),
        updated_timestamp: new Date().toISOString()
    };

    showToast('Saving leave request...', 'info');

    LeaveDb.saveLeave(leave, () => {
        showToast('Leave request saved successfully.', 'success');
        resetLeaveForm();
        
        // Go back to the leave menu view
        showView('leave-view');

        // Attempt immediate sync
        if (navigator.onLine) {
            syncLeaves();
        }
    });
}

let currentLeavesList = [];
let leaveStatusSource = 'client';
let reportViewSource = 'client';
let reportUsersCache = [];

function normalizeServerLeave(sLeave) {
    return {
        id: sLeave.id,
        client_id: sLeave.client_id,
        employee_name: sLeave.employee_name,
        leave_type: sLeave.leave_type,
        full_half_day: sLeave.full_half_day,
        start_date: normalizeDateOnly(sLeave.start_date),
        end_date: normalizeDateOnly(sLeave.end_date),
        total_days: parseFloat(sLeave.total_days) || 0,
        reason: sLeave.reason,
        in_absence: sLeave.in_absence,
        status: sLeave.status,
        sync_status: 'Synced',
        created_timestamp: sLeave.created_at || sLeave.created_timestamp,
        updated_timestamp: sLeave.updated_at || sLeave.updated_timestamp
    };
}

function normalizeDateOnly(value) {
    if (!value) return '';
    return String(value).includes('T') ? String(value).split('T')[0] : String(value).slice(0, 10);
}

async function fetchLeaveHistory() {
    renderLeaveHistorySkeletons();

    if (leaveStatusSource === 'admin') {
        try {
            const response = await apiRequest('/api/admin/leaves', 'GET');
            currentLeavesList = (response && response.success && response.leaves)
                ? response.leaves.map(normalizeServerLeave)
                : [];
            applyLeavesFilters();
        } catch (err) {
            console.error('[FetchLeaveHistory] Failed to fetch admin leaves:', err);
            currentLeavesList = [];
            applyLeavesFilters();
            showToast('Unable to load admin leave status.', 'error');
        }
        return;
    }

    const fetchLocalAndRender = () => {
        LeaveDb.getLeaves((list) => {
            currentLeavesList = list;
            applyLeavesFilters();
        });
    };

    if (navigator.onLine) {
        try {
            const response = await apiRequest('/api/client/leaves', 'GET');
            if (response && response.success && response.leaves) {
                let savedCount = 0;
                if (response.leaves.length === 0) {
                    fetchLocalAndRender();
                } else {
                    for (const sLeave of response.leaves) {
                        const localRecord = normalizeServerLeave(sLeave);
                        LeaveDb.saveLeave(localRecord, () => {
                            savedCount++;
                            if (savedCount === response.leaves.length) {
                                fetchLocalAndRender();
                            }
                        });
                    }
                }
            } else {
                fetchLocalAndRender();
            }
        } catch (err) {
            console.error('[FetchLeaveHistory] Failed to fetch from API:', err);
            fetchLocalAndRender();
        }
    } else {
        fetchLocalAndRender();
    }
}

function applyLeavesFilters() {
    const searchVal = document.getElementById('leaves-search').value.toLowerCase().trim();
    const statusVal = document.getElementById('leaves-filter-status').value;
    const typeVal = document.getElementById('leaves-filter-type').value;
    const sortVal = document.getElementById('leaves-sort').value;

    let list = [...currentLeavesList];

    if (searchVal) {
        list = list.filter(r => 
            (r.reason && r.reason.toLowerCase().includes(searchVal)) ||
            (r.employee_name && r.employee_name.toLowerCase().includes(searchVal)) ||
            (r.in_absence && r.in_absence.toLowerCase().includes(searchVal)) ||
            (r.leave_type && r.leave_type.toLowerCase().includes(searchVal))
        );
    }

    if (statusVal) {
        list = list.filter(r => r.status === statusVal);
    }

    if (typeVal) {
        list = list.filter(r => r.leave_type === typeVal);
    }

    if (sortVal === 'oldest') {
        list.sort((a, b) => new Date(a.created_timestamp) - new Date(b.created_timestamp));
    } else {
        list.sort((a, b) => new Date(b.created_timestamp) - new Date(a.created_timestamp));
    }

    updateLeaveStats(currentLeavesList);
    renderLeavesList(list);
}

function updateLeaveStats(fullList) {
    const applied = fullList.length;
    const approved = fullList.filter(r => r.status === 'Approved').length;
    const pending = fullList.filter(r => r.status === 'Pending').length;
    const rejected = fullList.filter(r => r.status === 'Rejected').length;

    const appliedEl = document.getElementById('stat-leaves-applied');
    const approvedEl = document.getElementById('stat-leaves-approved');
    const pendingEl = document.getElementById('stat-leaves-pending');
    const rejectedEl = document.getElementById('stat-leaves-rejected');

    if (appliedEl) appliedEl.textContent = applied.toString();
    if (approvedEl) approvedEl.textContent = approved.toString();
    if (pendingEl) pendingEl.textContent = pending.toString();
    if (rejectedEl) rejectedEl.textContent = rejected.toString();
}

function renderLeavesList(list) {
    const desktopTbody = document.getElementById('leaves-desktop-tbody');
    const mobileCards = document.getElementById('leaves-mobile-cards');

    if (!desktopTbody || !mobileCards) return;

    if (list.length === 0) {
        const noDataHtml = `
            <tr>
                <td colspan="9" style="text-align:center; padding:30px; color:var(--color-text-muted);">
                    <div style="font-size: 2rem; margin-bottom: 8px;">No data</div>
                    No leave requests found
                </td>
            </tr>
        `;
        desktopTbody.innerHTML = noDataHtml;
        mobileCards.innerHTML = `
            <div style="text-align:center; padding:30px; color:var(--color-text-muted); background:var(--color-bg-card); border-radius:12px; border:1px solid var(--color-border); width: 100%;">
                <div style="font-size: 2rem; margin-bottom: 8px;">No data</div>
                No leave requests found
            </div>
        `;
        return;
    }

    let desktopHtml = '';
    let mobileHtml = '';

    list.forEach((leave, idx) => {
        const srNo = idx + 1;
        const appliedOn = formatDateString(leave.created_timestamp);
        const duration = `${leave.start_date} to ${leave.end_date}`;
        const totalDays = parseFloat(leave.total_days).toFixed(1) + ' Days';
        const type = leave.leave_type;
        const reason = leave.reason || '--';
        const absence = leave.in_absence || '--';
        const status = leave.status || 'Pending';

        let badgeClass = 'status-pending';
        if (status === 'Approved') badgeClass = 'status-approved';
        else if (status === 'Rejected') badgeClass = 'status-rejected';
        else if (status === 'Cancelled') badgeClass = 'status-cancelled';

        const canCancel = (leaveStatusSource === 'client' && status === 'Pending');
        const cancelBtnHtml = canCancel 
            ? `<button class="remove-file-btn" onclick="cancelLeave('${leave.id}')" title="Cancel Leave Request">X</button>`
            : `<span style="color:var(--color-text-muted); font-size:0.8rem;">--</span>`;

        desktopHtml += `
            <tr>
                <td style="text-align:center; font-weight: 700;">${srNo}</td>
                <td>${appliedOn}</td>
                <td style="font-weight: 700; color: var(--color-blue-light);">${type}</td>
                <td style="font-size: 0.8rem;">${duration}</td>
                <td style="text-align:center; font-weight: 700; color: #10b981;">${totalDays}</td>
                <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${reason}">${reason}</td>
                <td>${absence}</td>
                <td style="text-align:center;">
                    <span class="status-badge ${badgeClass}">${status}</span>
                </td>
                <td style="text-align:center;">
                    <div style="display:flex; justify-content:center; align-items:center;">
                        ${cancelBtnHtml}
                    </div>
                </td>
            </tr>
        `;

        const mobileCancelBtnHtml = canCancel
            ? `<button class="primary-btn" onclick="cancelLeave('${leave.id}')" style="margin-top: 8px; font-size: 0.75rem; padding: 6px 12px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);">Cancel Request</button>`
            : '';

        mobileHtml += `
            <div class="leave-card-mobile">
                <div class="leave-card-header">
                    <span class="leave-card-type">${type}</span>
                    <span class="status-badge ${badgeClass}">${status}</span>
                </div>
                <div class="leave-card-body">
                    <div class="leave-card-row">
                        <span class="leave-card-label">Applied On:</span>
                        <span class="leave-card-val">${appliedOn}</span>
                    </div>
                    <div class="leave-card-row">
                        <span class="leave-card-label">Duration:</span>
                        <span class="leave-card-val" style="font-size:0.8rem;">${duration}</span>
                    </div>
                    <div class="leave-card-row">
                        <span class="leave-card-label">Total Days:</span>
                        <span class="leave-card-val" style="color: #10b981; font-weight: 700;">${totalDays}</span>
                    </div>
                    <div class="leave-card-row">
                        <span class="leave-card-label">Delegated To:</span>
                        <span class="leave-card-val">${absence}</span>
                    </div>
                    <div class="leave-card-reason">
                        <strong>Reason:</strong> ${reason}
                    </div>
                    ${mobileCancelBtnHtml}
                </div>
            </div>
        `;
    });

    desktopTbody.innerHTML = desktopHtml;
    mobileCards.innerHTML = mobileHtml;
}

function formatDateString(isoStr) {
    if (!isoStr) return '--';
    try {
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return '--';
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        return '--';
    }
}

function cancelLeave(id) {
    if (!confirm('Are you sure you want to cancel this leave request?')) return;

    showToast('Cancelling leave request...', 'info');

    LeaveDb.cancelLeaveLocal(id, () => {
        showToast('Leave request cancelled.', 'success');
        fetchLeaveHistory();

        if (navigator.onLine) {
            apiRequest(`/api/client/leave/${id}`, 'DELETE')
                .then(response => {
                    if (response && response.success) {
                        LeaveDb.markAsSynced([id], () => {
                            console.log('[CancelLeave] Leave status sync completed.');
                            showToast('Cancellation synchronized with server.', 'success');
                            fetchLeaveHistory();
                        });
                    }
                })
                .catch(err => {
                    console.error('[CancelLeave] Failed to sync cancel to server:', err);
                });
        }
    });
}

function renderLeaveHistorySkeletons() {
    const desktopTbody = document.getElementById('leaves-desktop-tbody');
    const mobileCards = document.getElementById('leaves-mobile-cards');

    if (desktopTbody) {
        desktopTbody.innerHTML = Array.from({ length: 3 }, (_, i) => `
            <tr>
                <td><div class="skeleton-loader" style="height: 16px; width: 30px; margin: auto;"></div></td>
                <td><div class="skeleton-loader" style="height: 16px; width: 80px;"></div></td>
                <td><div class="skeleton-loader" style="height: 16px; width: 100px;"></div></td>
                <td><div class="skeleton-loader" style="height: 16px; width: 80px;"></div></td>
                <td><div class="skeleton-loader" style="height: 16px; width: 40px; margin: auto;"></div></td>
                <td><div class="skeleton-loader" style="height: 16px; width: 120px;"></div></td>
                <td><div class="skeleton-loader" style="height: 16px; width: 100px;"></div></td>
                <td><div class="skeleton-loader" style="height: 16px; width: 70px; margin: auto;"></div></td>
                <td><div class="skeleton-loader" style="height: 16px; width: 30px; margin: auto;"></div></td>
            </tr>
        `).join('');
    }

    if (mobileCards) {
        mobileCards.innerHTML = Array.from({ length: 3 }, (_, i) => `
            <div class="leave-card-mobile">
                <div class="leave-card-header">
                    <div class="skeleton-loader" style="height: 18px; width: 120px;"></div>
                    <div class="skeleton-loader" style="height: 16px; width: 70px;"></div>
                </div>
                <div class="leave-card-body">
                    <div class="leave-card-row">
                        <div class="skeleton-loader" style="height: 14px; width: 80px;"></div>
                        <div class="skeleton-loader" style="height: 14px; width: 100px;"></div>
                    </div>
                    <div class="leave-card-row">
                        <div class="skeleton-loader" style="height: 14px; width: 80px;"></div>
                        <div class="skeleton-loader" style="height: 14px; width: 60px;"></div>
                    </div>
                    <div class="leave-card-reason">
                        <div class="skeleton-loader" style="height: 14px; width: 100%;"></div>
                        <div class="skeleton-loader" style="height: 14px; width: 80%; margin-top: 4px;"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

let isLeavesSyncing = false;

async function syncLeaves() {
    if (isLeavesSyncing) return;
    if (!navigator.onLine) return;

    LeaveDb.getPendingSync(async (pendingList) => {
        if (!pendingList || pendingList.length === 0) return;

        isLeavesSyncing = true;
        console.log(`[SyncLeaves] Found ${pendingList.length} leaves to sync.`);

        let successCount = 0;
        for (const leave of pendingList) {
            try {
                if (leave.status === 'Cancelled') {
                    const response = await apiRequest(`/api/client/leave/${leave.id}`, 'DELETE');
                    if (response && response.success) {
                        await new Promise(resolve => LeaveDb.markAsSynced([leave.id], resolve));
                        successCount++;
                    }
                } else {
                    const response = await apiRequest('/api/client/leave', 'POST', {
                        id: leave.id,
                        leave_type: leave.leave_type,
                        full_half_day: leave.full_half_day,
                        start_date: leave.start_date,
                        end_date: leave.end_date,
                        total_days: leave.total_days,
                        reason: leave.reason,
                        in_absence: leave.in_absence,
                        status: leave.status,
                        employee_name: leave.employee_name
                    });
                    if (response && response.success) {
                        await new Promise(resolve => LeaveDb.markAsSynced([leave.id], resolve));
                        successCount++;
                    }
                }
            } catch (err) {
                console.error('[SyncLeaves] Failed to sync leave:', leave.id, err);
            }
        }

        if (successCount > 0) {
            showNativeToast(`Synced ${successCount} offline leaves`);
        }
        isLeavesSyncing = false;
    });
}

function handleDSRSummaryReport() {
    openReportView('dsr-summary', 'client');
}

function handleDSRUpdatedList() {
    openReportView('dsr-list', 'client');
}

function handleStartEndDayReport() {
    openReportView('start-end', 'client');
}

function handleDSRSummaryReportAdmin() {
    openReportView('dsr-summary', 'admin');
}

function handleDSRUpdatedListAdmin() {
    openReportView('dsr-list', 'admin');
}

function handleStartEndDayReportAdmin() {
    openReportView('start-end', 'admin');
}

function handleLeaveStatusAdmin() {
    leaveStatusSource = 'admin';
    showView('leave-status-view');
    fetchLeaveHistory();
}

function goBackFromLeaveStatus() {
    showView(leaveStatusSource === 'admin' ? 'admin-view' : 'leave-view');
}

function goBackFromReport() {
    showView(reportViewSource === 'admin' ? 'admin-view' : 'reports-view');
}

function goToMainMenu() {
    const session = getSession();
    showView(reportViewSource === 'admin' || (session && session.role === 'admin') ? 'admin-view' : 'client-view');
}

async function openReportView(reportType, source) {
    reportViewSource = source || 'client';

    const viewMap = {
        'start-end': 'start-end-day-report-view',
        'dsr-summary': 'dsr-summary-report-view',
        'dsr-list': 'dsr-updated-list-view'
    };

    const viewId = viewMap[reportType];
    if (!viewId) return;

    setReportDateDefaults(reportType);
    showView(viewId);
    await populateReportUsers(reportType);
    await fetchReportData(reportType);
}

function setReportDateDefaults(reportType) {
    const prefixMap = {
        'start-end': 'start-end',
        'dsr-summary': 'dsr-summary',
        'dsr-list': 'dsr-list'
    };
    const prefix = prefixMap[reportType];
    const fromEl = document.getElementById(`${prefix}-from`);
    const tillEl = document.getElementById(`${prefix}-till`);
    const userEl = document.getElementById(`${prefix}-user`);
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    if (fromEl && !fromEl.value) fromEl.value = formatDateInput(firstDay);
    if (tillEl && !tillEl.value) tillEl.value = formatDateInput(today);
    if (userEl && !userEl.value) userEl.value = 'All';
}

function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function populateReportUsers(reportType) {
    const prefixMap = {
        'start-end': 'start-end',
        'dsr-summary': 'dsr-summary',
        'dsr-list': 'dsr-list'
    };
    const select = document.getElementById(`${prefixMap[reportType]}-user`);
    if (!select) return;

    const selected = select.value || 'All';

    try {
        if (reportUsersCache.length === 0) {
            const response = await apiRequest('/api/client/users', 'GET');
            reportUsersCache = (response && response.success && response.users) ? response.users : [];
        }

        select.innerHTML = '<option value="All">All</option>' + reportUsersCache.map(user => {
            const id = reportEscape(user.client_id || '');
            const name = reportEscape(user.name || user.client_id || '');
            return `<option value="${id}">${name}</option>`;
        }).join('');
        select.value = reportUsersCache.some(user => String(user.client_id) === selected) ? selected : 'All';
    } catch (err) {
        console.error('[Reports] Failed to populate users:', err);
        select.innerHTML = '<option value="All">All</option>';
        if (err.status === 401 || err.status === 403) {
            clearSession();
            showToast('Session expired or unauthorized. Please login again.', 'warning');
            showView('login-view');
        }
    }
}

function fetchStartEndDayReportData() {
    return fetchReportData('start-end');
}

function fetchDSRSummaryReportData() {
    return fetchReportData('dsr-summary');
}

function fetchDSRListReportData() {
    return fetchReportData('dsr-list');
}

async function fetchReportData(reportType) {
    const config = getReportConfig(reportType);
    if (!config) return;

    const userEl = document.getElementById(`${config.prefix}-user`);
    const fromEl = document.getElementById(`${config.prefix}-from`);
    const tillEl = document.getElementById(`${config.prefix}-till`);
    const tbody = document.querySelector(`#${config.tableId} tbody`);
    if (!tbody) return;

    const selectedUserId = userEl && userEl.value ? userEl.value : 'All';
    const selectedFromDate = fromEl ? fromEl.value : '';
    const selectedTillDate = tillEl ? tillEl.value : '';

    const params = new URLSearchParams({
        clientId: selectedUserId,
        fromDate: selectedFromDate,
        tillDate: selectedTillDate
    });

    tbody.innerHTML = `<tr><td colspan="${config.colspan}" class="table-empty">Loading report data...</td></tr>`;

    let serverRecords = [];
    let serverSuccess = false;
    let serverResponseObj = null;

    if (navigator.onLine) {
        try {
            const response = await apiRequest(`${config.endpoint}?${params.toString()}`, 'GET');
            if (response && response.success) {
                serverRecords = Array.isArray(response.records) ? response.records : [];
                serverSuccess = true;
                serverResponseObj = response;
            }
        } catch (err) {
            console.error(`[Reports] Failed to fetch server data for ${reportType}:`, err);
            if (err.status === 401 || err.status === 403) {
                clearSession();
                showToast('Session expired or unauthorized. Please login again.', 'warning');
                showView('login-view');
                return;
            }
        }
    }

    if (reportType === 'start-end') {
        if (serverSuccess) {
            config.render(tbody, serverRecords, serverResponseObj);
        } else {
            tbody.innerHTML = `<tr><td colspan="${config.colspan}" class="table-empty">Offline: Attendance data unavailable.</td></tr>`;
        }
        return;
    }

    // For DSR reports (dsr-list or dsr-summary)
    if (typeof DsrDb === 'undefined') {
        tbody.innerHTML = `<tr><td colspan="${config.colspan}" class="table-empty">Error: Local database is unavailable.</td></tr>`;
        return;
    }

    DsrDb.getDsrs((localList) => {
        // Filter local list based on selectedUserId, selectedFromDate, selectedTillDate
        const filteredLocal = localList.filter(rec => {
            if (selectedUserId && selectedUserId !== 'All') {
                if (String(rec.client_id) !== String(selectedUserId)) {
                    return false;
                }
            }
            if (rec.created_timestamp) {
                const recDateStr = rec.created_timestamp.substring(0, 10); // YYYY-MM-DD
                if (selectedFromDate && recDateStr < selectedFromDate) {
                    return false;
                }
                if (selectedTillDate && recDateStr > selectedTillDate) {
                    return false;
                }
            }
            return true;
        });

        // Determine which local records to merge
        // If server success: we only merge local 'Pending' sync records (so we don't duplicate already synced records)
        // If offline: we merge all local records (both 'Synced' and 'Pending')
        const localToMerge = serverSuccess 
            ? filteredLocal.filter(rec => rec.sync_status === 'Pending')
            : filteredLocal;

        // Map local records to server report format
        const mappedLocal = localToMerge.map(local => ({
            visited_by: local.client_name || local.client_id || '--',
            visited_on: local.created_timestamp,
            client: local.customer_name || '--',
            office_address: local.office_address || '--',
            site_name: local.site_name || '--',
            contact_person: local.contact_person || '--',
            contact_no: local.contact_no || '--',
            last_remark: local.last_remark || '--',
            visited_for: local.visited_for || '--',
            followup: local.followup || ''
        }));

        if (reportType === 'dsr-list') {
            const combinedList = [...mappedLocal, ...serverRecords];
            combinedList.sort((a, b) => new Date(b.visited_on) - new Date(a.visited_on));
            config.render(tbody, combinedList, null);
        } else if (reportType === 'dsr-summary') {
            let finalRecords = [];
            let finalStats = { total_visits: 0, total_dsr_updates: 0, total_followups: 0 };
            let finalStatusCounts = [];

            if (serverSuccess && serverResponseObj) {
                finalRecords = serverRecords;
                finalStats = serverResponseObj.stats || { total_visits: 0, total_dsr_updates: 0, total_followups: 0 };
                finalStatusCounts = serverResponseObj.statusCounts || [];

                mappedLocal.forEach(local => {
                    finalStats.total_visits++;
                    finalStats.total_dsr_updates++;
                    if (local.followup && local.followup !== 'null' && local.followup !== '') {
                        finalStats.total_followups++;
                    }

                    const status = local.visited_for || 'Others';
                    const statusObj = finalStatusCounts.find(s => s.visited_for === status);
                    if (statusObj) {
                        statusObj.count = (parseInt(statusObj.count) || 0) + 1;
                    } else {
                        finalStatusCounts.push({ visited_for: status, count: 1 });
                    }

                    const match = finalRecords.find(r => 
                        r.client_name === local.client && 
                        r.site_name === local.site_name && 
                        r.visited_for === local.visited_for && 
                        r.assigned_to === local.visited_by
                    );

                    if (match) {
                        match.no_of_visit = (parseInt(match.no_of_visit) || 0) + 1;
                    } else {
                        finalRecords.push({
                            client_name: local.client,
                            site_name: local.site_name,
                            visited_for: local.visited_for,
                            assigned_to: local.visited_by,
                            no_of_visit: 1
                        });
                    }
                });

                finalRecords.sort((a, b) => (a.client_name || '').localeCompare(b.client_name || ''));
            } else {
                const agg = aggregateLocalDsrs(mappedLocal);
                finalRecords = agg.records;
                finalStats = agg.stats;
                finalStatusCounts = agg.statusCounts;
            }

            const customResponse = {
                success: true,
                stats: finalStats,
                statusCounts: finalStatusCounts
            };

            config.render(tbody, finalRecords, customResponse);
        }
    });
}

function aggregateLocalDsrs(mappedList) {
    const groups = {};
    let totalVisits = 0;
    let totalDsrUpdates = 0;
    let totalFollowups = 0;
    const statusCountsMap = {};

    mappedList.forEach(rec => {
        totalVisits++;
        totalDsrUpdates++;
        if (rec.followup && rec.followup !== 'null' && rec.followup !== '') {
            totalFollowups++;
        }

        const status = rec.visited_for || 'Others';
        statusCountsMap[status] = (statusCountsMap[status] || 0) + 1;

        const key = `${rec.client}||${rec.site_name}||${rec.visited_for}||${rec.visited_by}`;
        if (!groups[key]) {
            groups[key] = {
                client_name: rec.client,
                site_name: rec.site_name,
                visited_for: rec.visited_for,
                assigned_to: rec.visited_by,
                no_of_visit: 0
            };
        }
        groups[key].no_of_visit++;
    });

    const records = Object.values(groups).sort((a, b) => (a.client_name || '').localeCompare(b.client_name || ''));
    const statusCounts = Object.keys(statusCountsMap).map(status => ({
        visited_for: status,
        count: statusCountsMap[status]
    }));

    return {
        records,
        stats: {
            total_visits: totalVisits,
            total_dsr_updates: totalDsrUpdates,
            total_followups: totalFollowups
        },
        statusCounts
    };
}

function getReportConfig(reportType) {
    const configs = {
        'start-end': {
            prefix: 'start-end',
            tableId: 'start-end-day-table',
            endpoint: '/api/client/reports/start-end',
            colspan: 7,
            render: renderStartEndReportRows
        },
        'dsr-summary': {
            prefix: 'dsr-summary',
            tableId: 'dsr-summary-table',
            endpoint: '/api/client/reports/dsr-summary',
            colspan: 6,
            render: renderDsrSummaryReportRows
        },
        'dsr-list': {
            prefix: 'dsr-list',
            tableId: 'dsr-updated-list-table',
            endpoint: '/api/client/reports/dsr-list',
            colspan: 11,
            render: renderDsrListReportRows
        }
    };
    return configs[reportType] || null;
}

function renderStartEndReportRows(tbody, records) {
    if (!records.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No start/end records found.</td></tr>';
        return;
    }

    tbody.innerHTML = records.map((row, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${reportEscape(row.client_name || row.client_id || '--')}</td>
            <td>${formatReportDateTime(row.start_time)}</td>
            <td>START</td>
            <td>${row.end_time ? formatReportDateTime(row.end_time) : '--'}</td>
            <td>${row.end_time ? 'END' : '-'}</td>
            <td>${reportEscape(row.duration || calculateReportDuration(row.start_time, row.end_time))}</td>
        </tr>
    `).join('');
}

function renderDsrSummaryReportRows(tbody, records, response) {
    const statsContainer = document.getElementById('dsr-summary-stats');
    const countsCard = document.getElementById('dsr-summary-status-counts-card');
    const countsContainer = document.getElementById('dsr-summary-status-counts');
    
    if (response && response.stats) {
        document.getElementById('dsr-summary-total-visits').textContent = response.stats.total_visits || 0;
        document.getElementById('dsr-summary-total-updates').textContent = response.stats.total_dsr_updates || 0;
        document.getElementById('dsr-summary-total-followups').textContent = response.stats.total_followups || 0;
        if (statsContainer) statsContainer.style.display = 'flex';
    } else {
        if (statsContainer) statsContainer.style.display = 'none';
    }

    if (response && Array.isArray(response.statusCounts) && response.statusCounts.length > 0) {
        if (countsContainer) {
            countsContainer.innerHTML = response.statusCounts.map(item => `
                <span class="badge" style="background-color: rgba(59, 130, 246, 0.12); color: var(--color-text-primary); border: 1px solid rgba(59, 130, 246, 0.25); padding: 4px 10px; border-radius: 9999px; font-weight: 600;">
                    ${reportEscape(item.visited_for)}: <strong style="color: #3b82f6; margin-left: 3px;">${item.count}</strong>
                </span>
            `).join('');
        }
        if (countsCard) countsCard.style.display = 'block';
    } else {
        if (countsCard) countsCard.style.display = 'none';
    }

    if (!records.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="table-empty">No DSR summary records found.</td></tr>';
        return;
    }

    let totalVisits = 0;
    const rowsHtml = records.map((row, index) => {
        const count = parseInt(row.no_of_visit) || 0;
        totalVisits += count;
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${reportEscape(row.client_name || '--')}</td>
                <td>${reportEscape(row.site_name || '--')}</td>
                <td>${reportEscape(row.visited_for || '--')}</td>
                <td>${reportEscape(row.assigned_to || '--')}</td>
                <td>${reportEscape(String(count))}</td>
            </tr>
        `;
    }).join('');

    const totalRowHtml = `
        <tr style="font-weight: bold; background-color: rgba(59, 130, 246, 0.08); border-top: 2px solid rgba(59, 130, 246, 0.25);">
            <td colspan="5" style="text-align: right; padding-right: 20px;">Total Visits:</td>
            <td>${totalVisits}</td>
        </tr>
    `;

    tbody.innerHTML = rowsHtml + totalRowHtml;
}

function renderDsrListReportRows(tbody, records) {
    if (!records.length) {
        tbody.innerHTML = '<tr><td colspan="11" class="table-empty">No DSR update records found.</td></tr>';
        return;
    }

    tbody.innerHTML = records.map((row, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${reportEscape(row.visited_by || '--')}</td>
            <td>${formatReportDateTime(row.visited_on)}</td>
            <td>${reportEscape(row.client || '--')}</td>
            <td>${reportEscape(row.office_address || '--')}</td>
            <td>${reportEscape(row.site_name || '--')}</td>
            <td>${reportEscape(row.contact_person || '--')}</td>
            <td>${reportEscape(row.contact_no || '--')}</td>
            <td>${reportEscape(row.last_remark || '--')}</td>
            <td>${reportEscape(row.visited_for || '--')}</td>
            <td>${row.followup ? reportEscape(row.followup) : '--'}</td>
        </tr>
    `).join('');
}

function formatReportDateTime(value) {
    if (!value) return '--';
    const date = new Date(value);
    if (isNaN(date.getTime())) return reportEscape(String(value));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function calculateReportDuration(startTime, endTime) {
    if (!startTime || !endTime) return '00 min';
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return '00 min';
    const diffMinutes = Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
    if (diffMinutes >= 60) {
        return `${Math.floor(diffMinutes / 60)} hr ${diffMinutes % 60} min`;
    }
    return `${diffMinutes} min`;
}

function reportEscape(value) {
    const div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
}

/**
 * Handle "Reminders" button action
 */
function handleReminders() {
    showView('reminders-view');
    applyRemindersFilter();
}

/**
 * Time selector population helper
 */
function populateTimeSelectors() {
    const hoursHtml = Array.from({length: 24}, (_, i) => {
        const val = i.toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
    }).join('');
    
    const minutesHtml = Array.from({length: 60}, (_, i) => {
        const val = i.toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
    }).join('');
    
    const bh = document.getElementById('booking-dispatch-hours');
    const bm = document.getElementById('booking-dispatch-minutes');
    const dh = document.getElementById('dsr-followup-hours');
    const dm = document.getElementById('dsr-followup-minutes');
    
    if (bh) bh.innerHTML = hoursHtml;
    if (bm) bm.innerHTML = minutesHtml;
    if (dh) dh.innerHTML = hoursHtml;
    if (dm) dm.innerHTML = minutesHtml;

    // Attach grade selector change listener
    const gradeSelect = document.getElementById('booking-grade');
    if (gradeSelect) {
        // Remove existing listener if any
        const newGradeSelect = gradeSelect.cloneNode(true);
        gradeSelect.parentNode.replaceChild(newGradeSelect, gradeSelect);
        newGradeSelect.addEventListener('change', () => {
            const otherInput = document.getElementById('booking-grade-other');
            if (otherInput) {
                otherInput.style.display = (newGradeSelect.value === 'Others') ? 'block' : 'none';
            }
        });
    }
}

/**
 * Client search & filter workflows
 */
let currentClientList = [];
let selectedClient = null;

async function fetchClientList() {
    const tableBody = document.getElementById('client-list-tbody');
    if (!tableBody) return;

    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--color-text-secondary);">Loading clients...</td></tr>`;

    const clientSearch = document.getElementById('search-client-input').value.trim();
    const groupSearch = document.getElementById('search-group-input').value.trim();

    const session = getSession();
    const userid = (session && session.userData && session.userData.name) || 'demo admin2';
    const gemptype = (session && session.role) || 'admin';

    let success = false;
    let list = [];

    // Attempt to pull from API if online
    if (navigator.onLine) {
        try {
            console.log('[ClientList] Fetching from API with search:', clientSearch, groupSearch);
            let response = await fetch('https://fleettrackon.co.in/skywaydia/getclientlistbygroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userid: userid,
                    gemptype: gemptype,
                    leadnametosearch: clientSearch,
                    groupnametosearch: groupSearch,
                    gempcluster: ""
                })
            });
            let data = await response.json();
            if (data && data.trackerid && data.trackerid.length > 0) {
                list = data.trackerid;
                success = true;
                console.log(`[ClientList] Loaded ${list.length} clients from API.`);
                // Cache clients in SQLite/localStorage
                ReminderDb.saveCachedClients(list);
            } else {
                // FALLBACK: Query with "demo admin2" and "admin" if empty
                console.log('[ClientList] Empty response for user. Falling back to demo admin2...');
                response = await fetch('https://fleettrackon.co.in/skywaydia/getclientlistbygroup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userid: "demo admin2",
                        gemptype: "admin",
                        leadnametosearch: clientSearch,
                        groupnametosearch: groupSearch,
                        gempcluster: ""
                    })
                });
                data = await response.json();
                if (data && data.trackerid && data.trackerid.length > 0) {
                    list = data.trackerid;
                    success = true;
                    console.log(`[ClientList] Loaded ${list.length} clients from API (demo admin2).`);
                    // Cache clients in SQLite/localStorage
                    ReminderDb.saveCachedClients(list);
                }
            }
        } catch (err) {
            console.error('[ClientList] API fetch failed:', err);
        }
    }

    if (!success) {
        console.log('[ClientList] API offline or failed, querying local cache...');
        await new Promise(resolve => {
            ReminderDb.searchCachedClients(clientSearch, groupSearch, localList => {
                list = localList;
                resolve();
            });
        });
        
        // If local SQLite is empty, fall back to default mock list
        if (!list || list.length === 0) {
            console.log('[ClientList] Local cache empty. Loading default mock clients...');
            const defaultMockList = [
                {
                    leadno: 965,
                    leadname: "PETROL PUMP - CHEMBUR",
                    address: "MUMBAI - 400071",
                    contactperson: "Rajesh Kumar",
                    contactno: "9876543210",
                    leadsitename: "Chembur Site",
                    reserved1: "PETROL PUMP"
                },
                {
                    leadno: 966,
                    leadname: "PIONEER HOUSING",
                    address: "322, COMMERCE HOUSE, 140, NAGINDAS MASTER ROAD, FORT, MUMBAI - 400023.",
                    contactperson: "Amit Shah",
                    contactno: "9820098200",
                    leadsitename: "Fort Site",
                    reserved1: "HOUSING"
                },
                {
                    leadno: 967,
                    leadname: "ABC CONSTRUCTION",
                    address: "ANDHERI EAST, MUMBAI",
                    contactperson: "Sanjay Dutt",
                    contactno: "9123456789",
                    leadsitename: "Andheri Site",
                    reserved1: "CONSTRUCTION"
                }
            ];
            
            // Filter locally if search params entered
            list = defaultMockList.filter(c => {
                let match = true;
                if (clientSearch) {
                    match = match && c.leadname.toLowerCase().includes(clientSearch.toLowerCase());
                }
                if (groupSearch) {
                    match = match && (c.reserved1 || '').toLowerCase().includes(groupSearch.toLowerCase());
                }
                return match;
            });

            // Cache default mocks
            ReminderDb.saveCachedClients(defaultMockList);
        }
    }

    currentClientList = list;
    renderClientList(list);
}

function renderClientList(list) {
    const tableBody = document.getElementById('client-list-tbody');
    if (!tableBody) return;

    if (list.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:var(--color-text-secondary);">No clients found</td></tr>`;
        return;
    }

    let html = '';
    list.forEach((c, index) => {
        const leadname = c.leadname || '';
        const address = c.address || '';
        const leadno = c.leadno || '';
        
        const escapedName = leadname.replace(/'/g, "\\'");
        const escapedAddress = address.replace(/'/g, "\\'");
        const escapedContactPerson = (c.contactperson || '').replace(/'/g, "\\'");
        const escapedContactNo = (c.contactno || '').replace(/'/g, "\\'");
        const escapedSiteName = (c.leadsitename || '').replace(/'/g, "\\'");

        html += `
            <tr>
                <td style="font-weight:700; color:var(--color-text-secondary);">${index + 1}</td>
                <td style="font-weight:700; color:var(--color-text-primary);">${leadname}</td>
                <td style="font-size:0.85rem; color:var(--color-text-secondary); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${address}</td>
                <td>
                    <button class="btn-booking" onclick="openBookingForm('${escapedName}', '${escapedSiteName}', '${escapedAddress}', '${leadno}')">Booking</button>
                </td>
                <td>
                    <button class="btn-dsr" onclick="openDSRForm('${escapedName}', '${escapedAddress}', '${escapedSiteName}', '${escapedContactPerson}', '${escapedContactNo}', '${leadno}')">Update DSR</button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

function filterClientList() {
    fetchClientList();
}

function clearClientListFilters() {
    document.getElementById('search-client-input').value = '';
    document.getElementById('search-group-input').value = '';
    fetchClientList();
}

function openBookingForm(name, siteName, address, leadno) {
    selectedClient = { name, siteName, address, leadno };
    
    document.getElementById('booking-client-name').value = name;
    document.getElementById('booking-site-name').value = siteName || '';
    document.getElementById('booking-office-address').value = address || '';
    document.getElementById('booking-quantity').value = '';
    document.getElementById('booking-grade').value = '';
    document.getElementById('booking-grade-other').value = '';
    document.getElementById('booking-grade-other').style.display = 'none';
    document.getElementById('booking-remark').value = '';
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-schedule-from').value = today;
    document.getElementById('booking-schedule-till').value = today;
    
    document.getElementById('booking-dispatch-hours').value = '00';
    document.getElementById('booking-dispatch-minutes').value = '00';

    showView('booking-view');
}

function openDSRForm(name, address, siteDetails, contactPerson, contactNo, leadno) {
    selectedClient = { name, address, siteDetails, contactPerson, contactNo, leadno };
    
    document.getElementById('dsr-customer-name').value = name;
    document.getElementById('dsr-office-address').value = address || '';
    document.getElementById('dsr-site-details').value = siteDetails || '';
    document.getElementById('dsr-contact-person').value = contactPerson || '';
    document.getElementById('dsr-contact-number').value = contactNo || '';
    document.getElementById('dsr-today-status').value = '';
    document.getElementById('dsr-remark').value = '';
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dsr-followup-date').value = today;
    
    document.getElementById('dsr-followup-hours').value = '00';
    document.getElementById('dsr-followup-minutes').value = '00';

    showView('existing-client-dsr-view');
}

async function submitDSR() {
    const name = document.getElementById('dsr-customer-name').value.trim();
    const address = document.getElementById('dsr-office-address').value.trim();
    const siteDetails = document.getElementById('dsr-site-details').value.trim();
    const contactPerson = document.getElementById('dsr-contact-person').value.trim();
    const contactNo = document.getElementById('dsr-contact-number').value.trim();
    const status = document.getElementById('dsr-today-status').value;
    const remark = document.getElementById('dsr-remark').value.trim();
    const followupDate = document.getElementById('dsr-followup-date').value;
    const hours = document.getElementById('dsr-followup-hours').value;
    const minutes = document.getElementById('dsr-followup-minutes').value;

    if (!name) {
        showToast('Customer Name is missing', 'error');
        return;
    }

    const session = getSession();
    const userid = (session && session.userData && session.userData.clientId) || '';
    const gemptype = (session && session.role) || 'client';
    const gempname = (session && session.userData && session.userData.name) || '';

    const currentDateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const dsrBody = {
        userid: userid,
        gemptype: gemptype,
        currentdatetime: currentDateTime,
        intime: "00:00:00",
        outtime: "00:00:00",
        outletname: name,
        nleadname: name,
        ncontact: contactNo,
        nremark: remark,
        nfollowup: followupDate || "",
        nfollowuptime: followupDate ? (hours + ":" + minutes) : "",
        assignedemp: "All",
        gpsLatitude: "0.0",
        gpsLongitude: "0.0",
        l_nremark: remark,
        n_nremark: remark,
        leaddatetime: currentDateTime,
        officeaddres: address,
        contactperson: contactPerson,
        gempname: gempname,
        follow_rem: remark,
        lleadno: (selectedClient && selectedClient.leadno) || ""
    };

    const curLatEl = document.getElementById('current-lat');
    const curLngEl = document.getElementById('current-lng');
    if (curLatEl && curLngEl) {
        const latVal = curLatEl.textContent.trim();
        const lngVal = curLngEl.textContent.trim();
        if (latVal !== '--' && lngVal !== '--') {
            dsrBody.gpsLatitude = latVal;
            dsrBody.gpsLongitude = lngVal;
        }
    }

    if (navigator.onLine) {
        try {
            console.log('[DSR] Submitting to third-party API...');
            await fetch('https://fleettrackon.co.in/skywaydia/updateleaddeatils_sky', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dsrBody)
            });
            console.log('[DSR] Third-party submission succeeded.');
        } catch (e) {
            console.error('[DSR] Third-party API failed:', e);
        }

        try {
            await fetch('https://fleettrackon.co.in/skywaydia/iamatevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gotiamatdate: currentDateTime,
                    gotempname: gempname,
                    gotempid: userid,
                    gotinoutstatus: "DSR_UPDATE",
                    gotiamatclient: name,
                    gotiamatlat: parseFloat(dsrBody.gpsLatitude),
                    gotiamatlong: parseFloat(dsrBody.gpsLongitude),
                    gimeinumber: (session && session.userData && session.userData.deviceId) || ""
                })
            });
        } catch (e) {}
    } else {
        showToast('Offline Mode: DSR saved locally.', 'info');
    }

    // Save DSR record locally
    if (typeof DsrDb !== 'undefined') {
        const localDsr = {
            client_id: userid,
            client_name: gempname,
            customer_name: name,
            office_address: address,
            site_name: siteDetails,
            contact_person: contactPerson,
            contact_no: contactNo,
            last_remark: remark,
            visited_for: status,
            followup: followupDate ? `${followupDate} ${hours}:${minutes}:00` : null,
            latitude: parseFloat(dsrBody.gpsLatitude) || 0.0,
            longitude: parseFloat(dsrBody.gpsLongitude) || 0.0,
            sync_status: 'Pending',
            created_timestamp: new Date().toISOString()
        };

        DsrDb.saveDsr(localDsr, (saved) => {
            console.log('[DSR] DSR saved locally:', saved);
            syncDSRs();
        });
    }

    if (status && followupDate && hours && minutes) {
        let reminderType = 'General Reminder';
        if (status === 'Follow Up') reminderType = 'Follow Up';
        else if (status === 'Document Submission') reminderType = 'Document Submission';
        else if (status === 'Bill Submission') reminderType = 'Bill Submission';
        else if (status === 'Payment Collection') reminderType = 'Payment Collection';
        else if (status === 'Document Collection') reminderType = 'Document Collection';

        const reminderTime = hours + ":" + minutes;
        const remId = 'REM_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const newReminder = {
            id: remId,
            client_name: name,
            contact_person: contactPerson,
            contact_number: contactNo,
            reminder_type: reminderType,
            reminder_date: followupDate,
            reminder_time: reminderTime,
            remark: remark,
            source_module: 'DSR',
            created_timestamp: new Date().toISOString(),
            updated_timestamp: new Date().toISOString(),
            status: 'Pending',
            sync_status: 'Pending'
        };

        ReminderDb.saveReminder(newReminder, (saved) => {
            console.log('[DSR] Reminder created locally:', saved);
            
            const dateParts = followupDate.split('-');
            const dateObj = new Date(
                parseInt(dateParts[0], 10),
                parseInt(dateParts[1], 10) - 1,
                parseInt(dateParts[2], 10),
                parseInt(hours, 10),
                parseInt(minutes, 10),
                0
            );
            
            if (window.AlarmBridge && typeof window.AlarmBridge.scheduleReminderNotification === 'function') {
                window.AlarmBridge.scheduleReminderNotification(
                    remId, name, reminderType, remark, reminderTime, dateObj.getTime()
                );
            }

            refreshRemindersCount();
            syncReminders();
        });
    }

    const currentDsrs = parseInt(localStorage.getItem('dsrUpdatesToday') || '0', 10) + 1;
    const currentVisits = parseInt(localStorage.getItem('visitsToday') || '0', 10) + 1;
    localStorage.setItem('dsrUpdatesToday', currentDsrs.toString());
    localStorage.setItem('visitsToday', currentVisits.toString());
    updateMetricsUI();

    showToast('DSR submitted successfully!', 'success');
    showView('dsr-client-list-view');
    fetchClientList();
}

async function submitBooking() {
    const clientName = document.getElementById('booking-client-name').value.trim();
    const siteName = document.getElementById('booking-site-name').value.trim();
    const address = document.getElementById('booking-office-address').value.trim();
    const qty = document.getElementById('booking-quantity').value.trim();
    let grade = document.getElementById('booking-grade').value;
    const gradeOther = document.getElementById('booking-grade-other').value.trim();
    const remark = document.getElementById('booking-remark').value.trim();
    const scheduleDate = document.getElementById('booking-schedule-from').value;
    const hours = document.getElementById('booking-dispatch-hours').value;
    const minutes = document.getElementById('booking-dispatch-minutes').value;

    if (!clientName) {
        showToast('Client Name is missing', 'error');
        return;
    }

    if (grade === 'Others' && gradeOther) {
        grade = gradeOther;
    }

    const fullRemark = `Qty: ${qty} M3 | Grade: ${grade} | Site: ${siteName} | ${remark}`;

    if (scheduleDate && hours && minutes) {
        const reminderTime = hours + ":" + minutes;
        const remId = 'REM_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

        const newReminder = {
            id: remId,
            client_name: clientName,
            contact_person: '',
            contact_number: '',
            reminder_type: 'Booking Dispatch',
            reminder_date: scheduleDate,
            reminder_time: reminderTime,
            remark: fullRemark,
            source_module: 'Booking',
            created_timestamp: new Date().toISOString(),
            updated_timestamp: new Date().toISOString(),
            status: 'Pending',
            sync_status: 'Pending'
        };

        ReminderDb.saveReminder(newReminder, (saved) => {
            console.log('[Booking] Booking reminder created locally:', saved);

            const dateParts = scheduleDate.split('-');
            const dateObj = new Date(
                parseInt(dateParts[0], 10),
                parseInt(dateParts[1], 10) - 1,
                parseInt(dateParts[2], 10),
                parseInt(hours, 10),
                parseInt(minutes, 10),
                0
            );

            if (window.AlarmBridge && typeof window.AlarmBridge.scheduleReminderNotification === 'function') {
                window.AlarmBridge.scheduleReminderNotification(
                    remId, clientName, 'Booking Dispatch', fullRemark, reminderTime, dateObj.getTime()
                );
            }

            refreshRemindersCount();
            syncReminders();
        });
    }

    const session = getSession();
    if (navigator.onLine && session) {
        try {
            const currentDateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
            const userid = session.userData.clientId || '';
            const gempname = session.userData.name || '';
            const curLatEl = document.getElementById('current-lat');
            const curLngEl = document.getElementById('current-lng');
            let latVal = 0;
            let lngVal = 0;
            if (curLatEl && curLngEl) {
                const latText = curLatEl.textContent.trim();
                const lngText = curLngEl.textContent.trim();
                if (latText !== '--' && lngText !== '--') {
                    latVal = parseFloat(latText);
                    lngVal = parseFloat(lngText);
                }
            }

            await fetch('https://fleettrackon.co.in/skywaydia/iamatevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gotiamatdate: currentDateTime,
                    gotempname: gempname,
                    gotempid: userid,
                    gotinoutstatus: "BOOKING_GENERATE",
                    gotiamatclient: clientName,
                    gotiamatlat: latVal,
                    gotiamatlong: lngVal,
                    gimeinumber: session.userData.deviceId || ""
                })
            });
        } catch (e) {}
    }

    const currentVisits = parseInt(localStorage.getItem('visitsToday') || '0', 10) + 1;
    localStorage.setItem('visitsToday', currentVisits.toString());
    updateMetricsUI();

    showToast('Booking generated successfully!', 'success');
    showView('dsr-client-list-view');
    fetchClientList();
}

/**
 * Reminder Sync logic
 */
let isRemindersSyncing = false;

async function syncReminders() {
    if (isRemindersSyncing) return;
    if (!navigator.onLine) return;

    ReminderDb.getPendingSync(async (pendingList) => {
        if (!pendingList || pendingList.length === 0) return;

        isRemindersSyncing = true;
        console.log(`[SyncReminders] Found ${pendingList.length} reminders to sync.`);

        try {
            const response = await apiRequest('/api/client/reminder/batch', 'POST', {
                reminders: pendingList
            });

            if (response && response.success) {
                const ids = pendingList.map(r => r.id);
                ReminderDb.markAsSynced(ids, () => {
                    console.log(`[SyncReminders] Synced ${ids.length} reminders.`);
                    showNativeToast(`Synced ${ids.length} offline reminders`);
                });
            }
        } catch (err) {
            console.error('[SyncReminders] Failed to sync reminders:', err);
        } finally {
            isRemindersSyncing = false;
        }
    });
}

/**
 * DSR Sync logic
 */
let isDsrSyncing = false;
async function syncDSRs() {
    if (isDsrSyncing) return;
    if (!navigator.onLine) return;

    if (typeof DsrDb === 'undefined') return;

    DsrDb.getPendingSync(async (pendingList) => {
        if (!pendingList || pendingList.length === 0) return;

        isDsrSyncing = true;
        console.log(`[SyncDsr] Found ${pendingList.length} DSR records to sync.`);

        let successIds = [];
        for (const dsr of pendingList) {
            try {
                const response = await apiRequest('/api/client/dsr-update', 'POST', {
                    customer_name: dsr.customer_name,
                    office_address: dsr.office_address,
                    site_name: dsr.site_name,
                    contact_person: dsr.contact_person,
                    contact_no: dsr.contact_no,
                    last_remark: dsr.last_remark,
                    visited_for: dsr.visited_for,
                    followup: dsr.followup,
                    latitude: dsr.latitude,
                    longitude: dsr.longitude,
                    client_name: dsr.client_name
                });
                if (response && response.success) {
                    successIds.push(dsr.id);
                }
            } catch (err) {
                console.error('[SyncDsr] Failed to sync individual DSR:', dsr.id, err);
            }
        }

        if (successIds.length > 0) {
            DsrDb.markAsSynced(successIds, () => {
                console.log(`[SyncDsr] Synced ${successIds.length} DSRs.`);
                showNativeToast(`Synced ${successIds.length} offline DSRs`);
            });
        }
        isDsrSyncing = false;
    });
}

/**
 * Reminder Dashboard & Action Workflows
 */
function completeReminder(id) {
    if (window.AlarmBridge && typeof window.AlarmBridge.cancelReminderNotification === 'function') {
        window.AlarmBridge.cancelReminderNotification(id);
    }

    ReminderDb.updateStatus(id, 'Completed', () => {
        showToast('Reminder marked as completed.', 'success');
        refreshRemindersCount();
        applyRemindersFilter();
        
        if (navigator.onLine) {
            apiRequest(`/api/client/reminder/${id}/status`, 'PUT', { status: 'Completed' })
                .then(() => {
                    ReminderDb.markAsSynced([id]);
                })
                .catch(err => {
                    console.error('[CompleteReminder] Server update failed:', err);
                });
        }
    });
}

function snoozeReminder(id, name, type, remark, oldTime, oldDate) {
    if (window.AlarmBridge && typeof window.AlarmBridge.cancelReminderNotification === 'function') {
        window.AlarmBridge.cancelReminderNotification(id);
    }

    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 10 * 60 * 1000);
    
    const newDateStr = snoozeTime.getFullYear() + '-' + 
        String(snoozeTime.getMonth() + 1).padStart(2, '0') + '-' + 
        String(snoozeTime.getDate()).padStart(2, '0');
        
    const newTimeStr = String(snoozeTime.getHours()).padStart(2, '0') + ':' + 
        String(snoozeTime.getMinutes()).padStart(2, '0');

    const updated = {
        id: id,
        client_name: name,
        reminder_type: type,
        remark: remark,
        reminder_date: newDateStr,
        reminder_time: newTimeStr,
        source_module: 'DSR',
        status: 'Pending',
        sync_status: 'Pending',
        updated_timestamp: new Date().toISOString()
    };

    ReminderDb.saveReminder(updated, () => {
        showToast('Reminder snoozed for 10 minutes.', 'info');
        
        if (window.AlarmBridge && typeof window.AlarmBridge.scheduleReminderNotification === 'function') {
            window.AlarmBridge.scheduleReminderNotification(
                id, name, type, remark, newTimeStr, snoozeTime.getTime()
            );
        }

        refreshRemindersCount();
        applyRemindersFilter();
        syncReminders();
    });
}

function refreshRemindersCount() {
    if (typeof ReminderDb === 'undefined') return;
    
    ReminderDb.getReminders((list) => {
        const todayStr = new Date().toISOString().split('T')[0];
        
        const todayReminders = list.filter(r => {
            let rDate = r.reminder_date || '';
            if (rDate.includes('T')) rDate = rDate.split('T')[0];
            return rDate === todayStr && r.status !== 'Completed';
        });

        const count = todayReminders.length;
        const countEl = document.getElementById('badge-reminders-count');
        if (countEl) {
            countEl.textContent = count.toString();
            countEl.style.display = count > 0 ? 'inline-block' : 'none';
        }

        const titleEl = document.getElementById('badge-reminders-title');
        if (titleEl) {
            titleEl.innerHTML = `Today's Reminders <span class="reminders-pending-badge">${count} Pending</span>`;
        }

        const descEl = document.getElementById('badge-reminders-desc');
        if (descEl) {
            if (count === 0) {
                descEl.textContent = 'Check tasks and reminders';
            } else {
                // Find next reminder time
                const pendingReminders = todayReminders.filter(r => r.status !== 'Completed');
                pendingReminders.sort((a, b) => (a.reminder_time || '').localeCompare(b.reminder_time || ''));
                let nextTimeStr = '';
                if (pendingReminders.length > 0) {
                    const timeRaw = pendingReminders[0].reminder_time || '';
                    if (timeRaw) {
                        // format to 12 hour AM/PM if it is HH:MM
                        const timeParts = timeRaw.split(':');
                        if (timeParts.length >= 2) {
                            let hrs = parseInt(timeParts[0], 10);
                            const mins = timeParts[1];
                            const ampm = hrs >= 12 ? 'PM' : 'AM';
                            hrs = hrs % 12;
                            hrs = hrs ? hrs : 12; // the hour '0' should be '12'
                            nextTimeStr = `${hrs}:${mins} ${ampm}`;
                        } else {
                            nextTimeStr = timeRaw;
                        }
                    }
                }

                const categories = {};
                todayReminders.forEach(r => {
                    const t = r.reminder_type || 'General Reminder';
                    categories[t] = (categories[t] || 0) + 1;
                });

                const previewLines = Object.keys(categories).map(cat => {
                    return `${categories[cat]} ${cat}`;
                });
                const descText = previewLines.join(', ');
                if (nextTimeStr) {
                    descEl.innerHTML = `<span class="reminder-next-time">Next: ${nextTimeStr}</span> <span class="divider">|</span> <span class="reminder-categories">${descText}</span>`;
                } else {
                    descEl.innerHTML = descText;
                }
            }
        }
        
        // Update welcome banner alerts
        const bannerCountEl = document.getElementById('banner-reminders-count-text');
        if (bannerCountEl) {
            bannerCountEl.textContent = count.toString();
        }
        const bannerPill = document.getElementById('banner-reminders-alert-pill');
        if (bannerPill) {
            bannerPill.style.display = count > 0 ? 'flex' : 'none';
        }

        // Update dashboard reminders card elements
        const dbPendingCount = document.getElementById('dashboard-reminders-pending-count');
        if (dbPendingCount) {
            dbPendingCount.textContent = count.toString();
        }
        const statPendingTasks = document.getElementById('stat-pending-tasks-count');
        if (statPendingTasks) {
            statPendingTasks.textContent = count.toString();
        }
        
        const dbNextTime = document.getElementById('dashboard-reminders-next-time');
        const dbNextDesc = document.getElementById('dashboard-reminders-next-desc');
        if (dbNextTime && dbNextDesc) {
            const pendingReminders = todayReminders.filter(r => r.status !== 'Completed');
            pendingReminders.sort((a, b) => (a.reminder_time || '').localeCompare(b.reminder_time || ''));
            if (pendingReminders.length > 0) {
                const nextRem = pendingReminders[0];
                let nextTimeStr = nextRem.reminder_time || '--:--';
                if (nextTimeStr) {
                    const timeParts = nextTimeStr.split(':');
                    if (timeParts.length >= 2) {
                        let hrs = parseInt(timeParts[0], 10);
                        const mins = timeParts[1];
                        const ampm = hrs >= 12 ? 'PM' : 'AM';
                        hrs = hrs % 12;
                        hrs = hrs ? hrs : 12;
                        nextTimeStr = `${hrs}:${mins} ${ampm}`;
                    }
                }
                dbNextTime.textContent = nextTimeStr;
                dbNextDesc.textContent = `${nextRem.reminder_type || 'Follow up'} with ${nextRem.client_name || 'Client'}`;
            } else {
                dbNextTime.textContent = '--:--';
                dbNextDesc.textContent = 'No upcoming reminders';
            }
        }
    });
}

function applyRemindersFilter() {
    const query = document.getElementById('reminders-search').value.trim();
    const typeFilter = document.getElementById('reminders-filter-type').value;
    const statusFilter = document.getElementById('reminders-filter-status').value;
    const sortBy = document.getElementById('reminders-sort').value;

    ReminderDb.searchReminders(query, typeFilter, statusFilter, sortBy, (list) => {
        renderRemindersList(list);
    });
}

function renderRemindersList(list) {
    const container = document.getElementById('reminders-list-container');
    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">No data</span>
                <p>No reminders found</p>
            </div>
        `;
        return;
    }

    let html = '';
    list.forEach(r => {
        let status = r.status || 'Pending';
        let rDate = r.reminder_date || '';
        if (rDate.includes('T')) rDate = rDate.split('T')[0];
        
        const rTime = r.reminder_time || '00:00';
        
        if (status === 'Pending') {
            const dateParts = rDate.split('-');
            const timeParts = rTime.split(':');
            const dueTime = new Date(
                parseInt(dateParts[0], 10),
                parseInt(dateParts[1], 10) - 1,
                parseInt(dateParts[2], 10),
                parseInt(timeParts[0], 10),
                parseInt(timeParts[1], 10),
                0
            );
            if (dueTime < new Date()) {
                status = 'Overdue';
            }
        }

        let statusClass = 'pending';
        if (status === 'Completed') statusClass = 'completed';
        if (status === 'Overdue') statusClass = 'overdue';

        const escapedName = (r.client_name || '').replace(/'/g, "\\'");
        const escapedType = (r.reminder_type || '').replace(/'/g, "\\'");
        const escapedRemark = (r.remark || '').replace(/'/g, "\\'");

        html += `
            <div class="reminder-card-premium">
                <div class="reminder-card-header">
                    <h3 class="reminder-client-name">${r.client_name || 'Unknown Client'}</h3>
                    <span class="status-tag ${statusClass}">${status}</span>
                </div>
                <div class="reminder-card-body">
                    <div class="reminder-meta-row">
                        <div class="reminder-meta-item">
                            <span>Date</span> <strong>Date:</strong> ${rDate}
                        </div>
                        <div class="reminder-meta-item">
                            <span>Time</span> <strong>Time:</strong> ${rTime}
                        </div>
                    </div>
                    <div class="reminder-meta-row" style="margin-top: 4px;">
                        <div class="reminder-meta-item">
                            <span>Type</span> <strong>Type:</strong> ${r.reminder_type || 'General Reminder'}
                        </div>
                    </div>
                    ${r.contact_person ? `
                    <div class="reminder-meta-row" style="margin-top: 4px;">
                        <div class="reminder-meta-item">
                            <span>Contact</span> <strong>Contact:</strong> ${r.contact_person} (${r.contact_number})
                        </div>
                    </div>
                    ` : ''}
                    ${r.remark ? `<p class="reminder-remark">"${r.remark}"</p>` : ''}
                </div>
                <div class="reminder-actions-row">
                    ${status !== 'Completed' ? `
                        <button class="action-btn-pill snooze" onclick="snoozeReminder('${r.id}', '${escapedName}', '${escapedType}', '${escapedRemark}', '${rTime}', '${rDate}')">Snooze</button>
                        <button class="action-btn-pill complete" onclick="completeReminder('${r.id}')">Complete</button>
                    ` : '<span style="color: #10b981; font-size: 0.725rem; font-weight: 700;">Completed</span>'}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Handle "Day End" button action
 */
function handleDayEnd() {
    if (!isDayStarted) {
        showToast('Please start your workday first by tapping "Day Start".', 'warning');
        return;
    }

    const session = getSession();

    let latVal = 0.0;
    let lngVal = 0.0;
    const curLatEl = document.getElementById('current-lat');
    const curLngEl = document.getElementById('current-lng');
    if (curLatEl && curLngEl) {
        const latText = curLatEl.textContent.trim();
        const lngText = curLngEl.textContent.trim();
        if (latText !== '--' && lngText !== '--') {
            latVal = parseFloat(latText);
            lngVal = parseFloat(lngText);
        }
    }

    if (navigator.onLine && session && session.userData) {
        const currentDate = new Date().toISOString().replace('T', ' ').slice(0, 19);
        const empid = (session.userData.name) || 'demo admin2';
        const imeino = session.userData.deviceId || '';

        // Call startendday
        fetch('https://fleettrackon.co.in/skywaydia/startendday', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gcdatetime: currentDate.slice(0, 16), // YYYY-MM-DD HH:MM
                glaststatus: "END",
                empid: empid,
                imeino: imeino,
                gpsLatitude: latVal,
                gpsLongitude: lngVal
            })
        }).catch(err => console.error('startendday END error:', err));

        // Call iamatevent
        fetch('https://fleettrackon.co.in/skywaydia/iamatevent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                gotiamatdate: currentDate,
                gotempname: empid,
                gotempid: session.userData.clientId || imeino,
                gotinoutstatus: "CHECKOUT",
                gotiamatclient: "",
                gotiamatlat: latVal,
                gotiamatlong: lngVal,
                gimeinumber: imeino
            })
        }).catch(err => console.error('iamatevent END error:', err));

        // Sync day end event locally
        let durationFormatted = '00 min';
        const startTime = localStorage.getItem('dayStartTime');
        if (startTime) {
            const diffSecs = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
            if (diffSecs >= 3600) {
                const hrs = Math.floor(diffSecs / 3600);
                const mins = Math.floor((diffSecs % 3600) / 60);
                durationFormatted = `${hrs} hr ${mins} min`;
            } else if (diffSecs >= 60) {
                const mins = Math.floor(diffSecs / 60);
                durationFormatted = `${mins} min`;
            }
        }

        apiRequest('/api/client/day-end', 'POST', {
            end_time: currentDate,
            end_lat: latVal,
            end_lng: lngVal,
            duration: durationFormatted
        }).catch(err => console.error('[API] Local day-end error:', err));
    }

    isDayStarted = false;
    isCheckedIn = false;
    
    localStorage.setItem('isDayStarted', 'false');
    localStorage.setItem('isCheckedIn', 'false');

    if (window.durationInterval) {
        clearInterval(window.durationInterval);
        window.durationInterval = null;
    }
    const startTime = localStorage.getItem('dayStartTime');
    let finalDuration = '00:00';
    if (startTime) {
        const diffMs = Date.now() - parseInt(startTime, 10);
        const diffSecs = Math.floor(diffMs / 1000);
        const hrs = Math.floor(diffSecs / 3600).toString().padStart(2, '0');
        const mins = Math.floor((diffSecs % 3600) / 60).toString().padStart(2, '0');
        finalDuration = `${hrs}:${mins}`;
        localStorage.setItem('lastWorkDuration', finalDuration);
    }
    localStorage.removeItem('dayStartTime');

    // Stop tracking
    stopLocationTracking();
    setTrackingUI(false);

    // Update UI
    updateWorkdayUI();
    updateMetricsUI();

    showToast('Workday ended. Location tracking is stopped.', 'warning');
}

/**
 * Toggle the Collapsible System Status / Diagnostics Drawer
 */
function toggleDiagnostics() {
    const panel = document.getElementById('diagnostics-drawer-panel');
    const chevron = document.getElementById('chevron-diagnostics');
    
    if (panel) {
        if (panel.classList.contains('collapsed')) {
            panel.classList.remove('collapsed');
            if (chevron) chevron.classList.add('rotated');
        } else {
            panel.classList.add('collapsed');
            if (chevron) chevron.classList.remove('rotated');
        }
    }
}

/**
 * =======================================================
 * Redesigned New Client Form Logic & Accordion Management
 * =======================================================
 */

let newClientUploadedFiles = {
    pan: null,
    gst: null
};

function resetNewClientForm() {
    const fields = [
        'new-client-name', 'new-client-pan', 'new-client-gst',
        'new-client-address', 'new-client-mobile', 'new-client-landline',
        'new-client-email', 'new-client-directors', 'new-client-site-details',
        'new-client-contact-person', 'new-client-contact-number', 'new-client-site-landline',
        'new-client-bank-acc', 'new-client-bank-name', 'new-client-bank-address',
        'new-client-bank-ifsc', 'new-client-ref1', 'new-client-ref2',
        'new-client-remark', 'new-client-followup-date', 'new-client-lat', 'new-client-lng'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    removeNewClientUploadedFile(null, 'pan');
    removeNewClientUploadedFile(null, 'gst');
}

function populateNewClientTimeSelectors() {
    const hoursHtml = Array.from({length: 24}, (_, i) => {
        const val = i.toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
    }).join('');
    
    const minutesHtml = Array.from({length: 60}, (_, i) => {
        const val = i.toString().padStart(2, '0');
        return `<option value="${val}">${val}</option>`;
    }).join('');
    
    const bh = document.getElementById('new-client-followup-hours');
    const bm = document.getElementById('new-client-followup-minutes');
    if (bh) bh.innerHTML = hoursHtml;
    if (bm) bm.innerHTML = minutesHtml;
}

function toggleAccordionSection(sectionNum) {
    for (let i = 1; i <= 6; i++) {
        const header = document.getElementById(`accordion-header-${i}`);
        const content = document.getElementById(`section-${i}-content`);
        if (header && content) {
            if (i === sectionNum) {
                content.classList.add('open');
                header.classList.add('active');
            } else {
                content.classList.remove('open');
                header.classList.remove('active');
            }
        }
    }
}

function updateRegistrationProgress() {
    const fields = [
        'new-client-name', 'new-client-pan', 'new-client-gst',
        'new-client-address', 'new-client-mobile', 'new-client-email',
        'new-client-directors', 'new-client-site-details', 'new-client-contact-person',
        'new-client-contact-number', 'new-client-bank-acc', 'new-client-bank-name',
        'new-client-bank-ifsc', 'new-client-ref1', 'new-client-remark'
    ];
    let filled = 0;
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value.trim() !== '') {
            filled++;
        }
    });
    
    if (newClientUploadedFiles.pan) filled++;
    if (newClientUploadedFiles.gst) filled++;
    
    const percent = Math.round((filled / (fields.length + 2)) * 100);
    const fillEl = document.getElementById('reg-progress-fill');
    const percentEl = document.getElementById('reg-progress-percent');
    if (fillEl) fillEl.style.width = `${percent}%`;
    if (percentEl) percentEl.textContent = `${percent}%`;
}

function triggerNewClientFileInput(id) {
    const el = document.getElementById(id);
    if (el) el.click();
}

function handleNewClientFileUpload(input, type) {
    const file = input.files[0];
    if (!file) return;
    
    newClientUploadedFiles[type] = file;
    
    const uploadContent = document.getElementById(`${type}-upload-content`);
    const uploadPreview = document.getElementById(`${type}-upload-preview`);
    
    if (uploadContent && uploadPreview) {
        uploadContent.style.display = 'none';
        uploadPreview.classList.remove('hidden');
        
        let previewHtml = `
            <div class="file-info-bar">
                <span class="file-name">${file.name}</span>
                <span class="upload-success-badge">Success</span>
                <div class="remove-file-btn" onclick="removeNewClientUploadedFile(event, '${type}')">×</div>
            </div>
        `;
        
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadPreview.innerHTML = `<img src="${e.target.result}" class="preview-thumbnail">` + previewHtml;
            };
            reader.readAsDataURL(file);
        } else {
            uploadPreview.innerHTML = `<span style="font-size: 2.5rem; display: block; margin-bottom: 5px;">File</span>` + previewHtml;
        }
    }
    updateRegistrationProgress();
}

function removeNewClientUploadedFile(event, type) {
    if (event) event.stopPropagation();
    
    newClientUploadedFiles[type] = null;
    const fileInput = document.getElementById(`new-client-${type}-file`);
    if (fileInput) fileInput.value = '';
    
    const uploadContent = document.getElementById(`${type}-upload-content`);
    const uploadPreview = document.getElementById(`${type}-upload-preview`);
    
    if (uploadContent && uploadPreview) {
        uploadContent.style.display = 'flex';
        uploadPreview.classList.add('hidden');
        uploadPreview.innerHTML = '';
    }
    updateRegistrationProgress();
}

// Bind input listener to update progress bar dynamically
function bindNewClientProgressListeners() {
    const fields = [
        'new-client-name', 'new-client-pan', 'new-client-gst',
        'new-client-address', 'new-client-mobile', 'new-client-email',
        'new-client-directors', 'new-client-site-details', 'new-client-contact-person',
        'new-client-contact-number', 'new-client-bank-acc', 'new-client-bank-name',
        'new-client-bank-ifsc', 'new-client-ref1', 'new-client-remark'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updateRegistrationProgress);
        }
    });
}

async function submitNewClient() {
    if (!isDayStarted) {
        showToast('Please start your workday first by tapping "Day Start".', 'warning');
        return;
    }

    const clientName = document.getElementById('new-client-name').value.trim();
    const officeAddress = document.getElementById('new-client-address').value.trim();
    
    const siteDetails = document.getElementById('new-client-site-details').value.trim();
    const contactPerson = document.getElementById('new-client-contact-person').value.trim();
    const contactNumber = document.getElementById('new-client-contact-number').value.trim();
    
    const email = document.getElementById('new-client-email').value.trim();
    const remark = document.getElementById('new-client-remark').value.trim();
    const followupDate = document.getElementById('new-client-followup-date').value.trim();
    
    // Validations
    if (!clientName) {
        showToast('Client Name is required.', 'error');
        toggleAccordionSection(1);
        document.getElementById('new-client-name').focus();
        return;
    }
    if (!officeAddress) {
        showToast('Office Address is required.', 'error');
        toggleAccordionSection(2);
        document.getElementById('new-client-address').focus();
        return;
    }
    if (!siteDetails) {
        showToast('Site Details is required.', 'error');
        toggleAccordionSection(3);
        document.getElementById('new-client-site-details').focus();
        return;
    }
    if (!contactPerson) {
        showToast('Contact Person is required.', 'error');
        toggleAccordionSection(3);
        document.getElementById('new-client-contact-person').focus();
        return;
    }
    if (!contactNumber) {
        showToast('Contact Number is required.', 'error');
        toggleAccordionSection(3);
        document.getElementById('new-client-contact-number').focus();
        return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        toggleAccordionSection(2);
        document.getElementById('new-client-email').focus();
        return;
    }

    const session = getSession();
    const userid = (session && session.userData && session.userData.clientId) || '';
    const gemptype = (session && session.role) || 'client';
    const gempname = (session && session.userData && session.userData.name) || '';

    const currentDateTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
    
    let hours = '00';
    let minutes = '00';
    const hourEl = document.getElementById('new-client-followup-hours');
    const minEl = document.getElementById('new-client-followup-minutes');
    if (hourEl) hours = hourEl.value;
    if (minEl) minutes = minEl.value;

    const dsrBody = {
        userid: userid,
        gemptype: gemptype,
        currentdatetime: currentDateTime,
        intime: "00:00:00",
        outtime: "00:00:00",
        outletname: clientName,
        nleadname: clientName,
        ncontact: contactNumber,
        nremark: remark,
        nfollowup: followupDate || "",
        nfollowuptime: followupDate ? (hours + ":" + minutes) : "",
        assignedemp: "All",
        gpsLatitude: document.getElementById('new-client-lat').value || "0.0",
        gpsLongitude: document.getElementById('new-client-lng').value || "0.0",
        l_nremark: remark,
        n_nremark: remark,
        leaddatetime: currentDateTime,
        officeaddres: officeAddress,
        contactperson: contactPerson,
        gempname: gempname,
        follow_rem: remark,
        lleadno: "" // Empty for new client registration!
    };

    showToast('Submitting New Client Registration...', 'info');

    // 1. Submit to FleetTrackon APIs if online
    if (navigator.onLine) {
        try {
            console.log('[NewClient] Submitting to third-party API...');
            await fetch('https://fleettrackon.co.in/skywaydia/updateleaddeatils_sky', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dsrBody)
            });
            console.log('[NewClient] Third-party API registration success.');
        } catch (e) {
            console.error('[NewClient] Third-party API failed:', e);
        }

        try {
            await fetch('https://fleettrackon.co.in/skywaydia/iamatevent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    gotiamatdate: currentDateTime,
                    gotempname: gempname,
                    gotempid: userid,
                    gotinoutstatus: "DSR_UPDATE",
                    gotiamatclient: clientName,
                    gotiamatlat: parseFloat(dsrBody.gpsLatitude),
                    gotiamatlong: parseFloat(dsrBody.gpsLongitude),
                    gimeinumber: (session && session.userData && session.userData.deviceId) || ""
                })
            });
        } catch (e) {}
    } else {
        showToast('Offline Mode: DSR saved locally.', 'info');
    }

    // Save DSR record locally
    if (typeof DsrDb !== 'undefined') {
        const localDsr = {
            client_id: userid,
            client_name: gempname,
            customer_name: clientName,
            office_address: officeAddress,
            site_name: siteDetails,
            contact_person: contactPerson,
            contact_no: contactNumber,
            last_remark: remark,
            visited_for: 'New Registration',
            followup: followupDate ? `${followupDate} ${hours}:${minutes}:00` : null,
            latitude: parseFloat(dsrBody.gpsLatitude) || 0.0,
            longitude: parseFloat(dsrBody.gpsLongitude) || 0.0,
            sync_status: 'Pending',
            created_timestamp: new Date().toISOString()
        };

        DsrDb.saveDsr(localDsr, (saved) => {
            console.log('[NewClient] DSR saved locally:', saved);
            syncDSRs();
        });
    }

    // 2. Automatically create Follow-up Reminder if date is entered
    if (followupDate) {
        const reminderTime = hours + ":" + minutes;
        const remId = 'REM_' + Date.now();
        const reminderType = 'New Client Follow Up';

        const newReminder = {
            id: remId,
            client_id: userid,
            client_name: clientName,
            contact_person: contactPerson,
            contact_number: contactNumber,
            reminder_type: reminderType,
            reminder_date: followupDate,
            reminder_time: reminderTime,
            remark: remark,
            source_module: 'NewClient',
            created_timestamp: new Date().toISOString(),
            updated_timestamp: new Date().toISOString(),
            status: 'Pending',
            sync_status: 'Pending'
        };

        ReminderDb.saveReminder(newReminder, (saved) => {
            console.log('[NewClient] Reminder created locally:', saved);
            
            const dateParts = followupDate.split('-');
            const dateObj = new Date(
                parseInt(dateParts[0], 10),
                parseInt(dateParts[1], 10) - 1,
                parseInt(dateParts[2], 10),
                parseInt(hours, 10),
                parseInt(minutes, 10),
                0
            );
            
            if (window.AlarmBridge && typeof window.AlarmBridge.scheduleReminderNotification === 'function') {
                window.AlarmBridge.scheduleReminderNotification(
                    remId, clientName, reminderType, remark, reminderTime, dateObj.getTime()
                );
            }

            refreshRemindersCount();
            syncReminders();
        });
    }

    const currentDsrs = parseInt(localStorage.getItem('dsrUpdatesToday') || '0', 10) + 1;
    const currentVisits = parseInt(localStorage.getItem('visitsToday') || '0', 10) + 1;
    localStorage.setItem('dsrUpdatesToday', currentDsrs.toString());
    localStorage.setItem('visitsToday', currentVisits.toString());
    updateMetricsUI();

    showToast('New client registered successfully!', 'success');
    showView('checkin-view');
}

/**
 * Update top-level metrics dynamically
 */
function updateMetricsUI() {
    const visits = parseInt(localStorage.getItem('visitsToday') || '0', 10);
    const dsrs = parseInt(localStorage.getItem('dsrUpdatesToday') || '0', 10);
    
    const visitsEl = document.getElementById('stat-visits-count');
    const dsrEl = document.getElementById('stat-dsr-count');
    const durationEl = document.getElementById('stat-duration-count');
    
    if (visitsEl) visitsEl.textContent = visits.toString();
    if (dsrEl) dsrEl.textContent = dsrs.toString();
    
    if (isDayStarted) {
        let startTime = localStorage.getItem('dayStartTime');
        if (!startTime) {
            startTime = Date.now().toString();
            localStorage.setItem('dayStartTime', startTime);
        }
        const diffMs = Date.now() - parseInt(startTime, 10);
        const diffSecs = Math.floor(diffMs / 1000);
        const hrs = Math.floor(diffSecs / 3600).toString().padStart(2, '0');
        const mins = Math.floor((diffSecs % 3600) / 60).toString().padStart(2, '0');
        
        if (durationEl) {
            durationEl.innerHTML = `${hrs}:${mins} <span class="stat-unit">hrs</span>`;
        }
    } else {
        const lastDuration = localStorage.getItem('lastWorkDuration') || '00:00';
        if (durationEl) {
            durationEl.innerHTML = `${lastDuration} <span class="stat-unit">hrs</span>`;
        }
    }
}
