/**
 * ============================================
 * App Core — SPA Router & Initialization
 * ============================================
 */

// ── SPA View Router ──

/**
 * Show a specific view, hide all others
 * @param {string} viewId - The ID of the view to show
 */
function showView(viewId) {
    const views = document.querySelectorAll('.view');
    
    views.forEach(view => {
        if (view.id === viewId) {
            // First set display, then trigger opacity transition
            view.style.display = 'flex';
            // Force reflow
            view.offsetHeight;
            view.classList.add('active');
        } else {
            view.classList.remove('active');
            // Wait for transition to finish before hiding
            setTimeout(() => {
                if (!view.classList.contains('active')) {
                    view.style.display = 'none';
                }
            }, 400);
        }
    });

    // Reset window scroll to top on transition
    window.scrollTo(0, 0);

    // Sync device ID fields on transitions to login/register views
    if (typeof populateDeviceIdFields === 'function') {
        try {
            populateDeviceIdFields();
        } catch(e) {
            console.error('[App] Failed to populate device ID fields on view show:', e);
        }
    }

    // Stop DSR timer when leaving the DSR form
    if (viewId !== 'existing-client-dsr-view' && typeof stopDsrTimer === 'function') {
        stopDsrTimer();
    }

    console.log('[App] View:', viewId);
}

// ── Cordova Initialization ──

let appReadyStarted = false;
let startupPermissionsRequested = false;

document.addEventListener('deviceready', () => {
    onDeviceReady('cordova');
}, false);

// Fallback for browser testing
document.addEventListener('DOMContentLoaded', () => {
    try {
        if (typeof initTheme === 'function') initTheme();
    } catch(e) {
        console.error(e);
    }
    if (!window.cordova) {
        console.log('[App] Running in browser mode (no Cordova)');
        onDeviceReady('browser');
        return;
    }

    setTimeout(() => {
        if (!appReadyStarted) {
            console.warn('[App] deviceready did not fire in time. Continuing with limited Cordova APIs.');
            onDeviceReady('cordova-timeout');
        }
    }, 3000);
});

/**
 * Device ready handler — entry point
 */
function onDeviceReady(source) {
    if (appReadyStarted) return;
    appReadyStarted = true;

    try {
        if (typeof initTheme === 'function') initTheme();
    } catch(e) {
        console.error(e);
    }

    console.log('[App] Device ready');
    console.log('[App] Ready source:', source || 'unknown');
    console.log('[App] Platform:', typeof device !== 'undefined' ? device.platform : 'Browser');

    // Initialize device ID safely
    try {
        initDeviceId();
    } catch (e) {
        console.error('[App] Failed to init device ID:', e);
    }

    // Request notification permission safely on startup (required for Android 13+ foreground notification)
    try {
        if (typeof Notification !== 'undefined' && typeof Notification.requestPermission === 'function') {
            // Some WebViews require callback, some return promise, some throw in file:// or insecure contexts.
            const req = Notification.requestPermission((permission) => {
                console.log('[App] Notification permission status (callback):', permission);
            });
            if (req && typeof req.then === 'function') {
                req.then(permission => {
                    console.log('[App] Notification permission status (promise):', permission);
                }).catch(err => {
                    console.error('[App] Notification permission promise error:', err);
                });
            }
        }
    } catch (err) {
        console.warn('[App] Safe Notification.requestPermission threw exception:', err);
    }

    // Check for existing session safely
    let session = null;
    try {
        session = getSession();
    } catch (e) {
        console.error('[App] Failed to get session:', e);
    }

    setTimeout(() => {
        try {
            if (session && session.token) {
                console.log('[App] Resuming session:', session.role);
                
                if (session.role === 'client' && session.userData) {
                    enterClientSession(session.userData);
                } else if (session.role === 'admin' && session.userData) {
                    initAdminDashboard(session.userData);
                    showView('admin-view');
                } else {
                    showView('login-view');
                }
            } else {
                showView('login-view');
            }
        } catch (err) {
            console.error('[App] Exception in routing session, showing login:', err);
            showView('login-view');
        }
    }, 1800); // Show splash for 1.8 seconds
}

// ── Handle back button (Android) ──
document.addEventListener('backbutton', (e) => {
    e.preventDefault();

    const activeView = document.querySelector('.view.active');
    if (!activeView) return;

    switch (activeView.id) {
        case 'checkin-view':
        case 'leave-view':
        case 'reports-view':
            showView('client-view');
            break;
        case 'start-end-day-report-view':
        case 'dsr-summary-report-view':
        case 'dsr-updated-list-view':
            if (typeof goBackFromReport === 'function') {
                goBackFromReport();
            } else {
                showView('reports-view');
            }
            break;
        case 'leave-status-view':
            if (typeof goBackFromLeaveStatus === 'function') {
                goBackFromLeaveStatus();
            } else {
                showView('leave-view');
            }
            break;
        case 'client-detail-view':
            showView('admin-view');
            break;
        case 'register-view':
            showView('login-view');
            break;
        case 'client-view':
        case 'admin-view':
            // Confirm exit
            if (navigator.notification) {
                navigator.notification.confirm(
                    'Are you sure you want to exit?',
                    (buttonIndex) => {
                        if (buttonIndex === 1) {
                            navigator.app.exitApp();
                        }
                    },
                    'Exit App',
                    ['Exit', 'Cancel']
                );
            } else if (confirm('Are you sure you want to exit?')) {
                navigator.app && navigator.app.exitApp();
            }
            break;
        case 'login-view':
            navigator.app && navigator.app.exitApp();
            break;
    }
}, false);

// ── Handle app pause/resume ──
document.addEventListener('pause', () => {
    console.log('[App] Paused (backgrounded)');
    // Tracking continues via background service — no action needed
}, false);

document.addEventListener('resume', () => {
    console.log('[App] Resumed');
    
    // Refresh admin dashboard if applicable
    const session = getSession();
    if (session) {
        if (session.role === 'admin') {
            refreshClients();
        } else if (session.role === 'client') {
            if (typeof updateNetworkStatus === 'function') {
                updateNetworkStatus();
            }
            if (typeof syncPendingLocations === 'function') {
                syncPendingLocations();
            }
            if (typeof refreshDatabaseLocationCount === 'function') {
                refreshDatabaseLocationCount();
            }
        }
    }
}, false);

/**
 * Request advanced background and overlay permissions safely
 * via the custom AlarmBridge native plugin
 */
function requestBackgroundPermissions() {
    if (!window.AlarmBridge) {
        console.warn('[Permissions] window.AlarmBridge is undefined. Native permissions skipped.');
        return;
    }
    console.log('[Permissions] Requesting advanced background and overlay permissions safely...');

    // 1. Request notification permission (non-intrusive)
    callNativePermission('requestNotificationPermission');

    // 2. Request full screen intent permission (opens system settings, delayed to prevent UI lockup)
    setTimeout(() => {
        callNativePermission('requestFullScreenIntentPermission');
    }, 1000);

    // 3. Request draw-over-apps overlay permission (opens system settings, delayed further)
    setTimeout(() => {
        callNativePermission('requestOverlayPermission');
    }, 2500);

    // 4. Request ignore battery optimization (opens system settings, delayed further)
    setTimeout(() => {
        callNativePermission('requestBatteryOptimizationExemption');
    }, 4000);
}

function scheduleStartupPermissions() {
    if (startupPermissionsRequested) return;
    startupPermissionsRequested = true;

    setTimeout(() => {
        requestLocationPermissionPrompt();
    }, 800);
}

function requestLocationPermissionPrompt() {
    // Proactively call native C# prompt first to ensure native system permission runs
    if (window.AlarmBridge && typeof window.AlarmBridge.requestLocationPermission === 'function') {
        window.AlarmBridge.requestLocationPermission();
    }

    if (typeof invokeCSharp === 'function') {
        invokeCSharp('GetCurrentLocation')
            .then(locJson => {
                if (locJson) {
                    const loc = JSON.parse(locJson);
                    console.log('[Permissions] Pre-fetched native coordinates:', loc);
                    if (typeof updateLocationUI === 'function') {
                        updateLocationUI(loc.latitude, loc.longitude);
                    }
                }
            })
            .catch(err => console.warn('[Permissions] Pre-fetch native location failed:', err));
    } else if (navigator.geolocation && typeof navigator.geolocation.getCurrentPosition === 'function') {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('[Permissions] Location permission granted.');
                if (position && position.coords && typeof updateLocationUI === 'function') {
                    updateLocationUI(position.coords.latitude, position.coords.longitude);
                }
            },
            (err) => console.warn('[Permissions] Location permission not granted:', err && err.message ? err.message : err),
            {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 0
            }
        );
    }
}

function enterClientSession(clientData) {
    showView('client-view');

    // Request location permissions safely after dashboard view is shown
    setTimeout(() => {
        try {
            requestLocationPermissionPrompt();
        } catch (err) {
            console.error('[Permissions] Location permission request failed:', err);
        }
    }, 800);

    setTimeout(() => {
        try {
            initClientDashboard(clientData);
        } catch (err) {
            console.error('[App] Client dashboard init failed:', err);
            showToast('Location setup failed. Please check app permissions.', 'warning', 5000);
        }
    }, 250);

    setTimeout(() => {
        try {
            requestBackgroundPermissions();
        } catch (err) {
            console.error('[Permissions] Permission request flow failed:', err);
        }
    }, 1500);
}

function callNativePermission(methodName) {
    if (!window.AlarmBridge || typeof window.AlarmBridge[methodName] !== 'function') {
        console.warn(`[Permissions] ${methodName} is unavailable.`);
        return;
    }

    try {
        window.AlarmBridge[methodName](
            (res) => console.log(`[Permissions] ${methodName} success:`, res),
            (err) => console.error(`[Permissions] ${methodName} error:`, err)
        );
    } catch (err) {
        console.error(`[Permissions] ${methodName} threw:`, err);
    }
}

// ── Layout helpers from original Cordova index.html inline script ──
function toggleProfileDropdown() {
    const dropdownMenu = document.getElementById('profile-dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
    }
}

function toggleClientStats(event) {
    const container = document.getElementById('client-stats-container');
    const arrow = document.getElementById('stats-toggle-arrow');
    if (container) {
        const isExpanded = container.classList.toggle('expanded');
        if (arrow) {
            if (isExpanded) {
                arrow.style.transform = 'rotate(180deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
        }
    }
}

window.addEventListener('click', function(event) {
    const dropdownContainer = document.querySelector('.profile-dropdown-container');
    const dropdownMenu = document.getElementById('profile-dropdown-menu');
    if (dropdownContainer && dropdownMenu && !dropdownContainer.contains(event.target)) {
        dropdownMenu.classList.remove('show');
    }
});
