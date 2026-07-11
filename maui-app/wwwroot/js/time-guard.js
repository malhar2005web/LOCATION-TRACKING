/**
 * ============================================================================
 * TimeGuard - Enterprise Anti-Time-Tampering Protection
 * Multi-layer security to prevent attendance/DSR clock manipulation.
 * Exposes: window.TimeGuard
 * ============================================================================
 */

(function () {
    'use strict';

    // Constants & Limits
    const SECONDS_30 = 30 * 1000;
    const MINUTES_2 = 2 * 60 * 1000;
    const SYNC_INTERVAL = 60 * 1000; // Recalculate offset every 60s

    // State Variables
    let timeOffsetMs = 0;
    let isOffsetSynced = false;
    let activeSyncPromise = null;
    let warningBannerEl = null;
    let blockingOverlayEl = null;

    /**
     * Fetch standard time from server or fallback API
     * Returns: epoch milliseconds or null on failure
     */
    async function fetchServerTime() {
        const endpoints = [
            window.API_BASE_URL || 'https://fleettrackon.co.in/skywaydia',
            'https://worldtimeapi.org/api/timezone/Asia/Kolkata',
            'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Kolkata'
        ];

        for (const url of endpoints) {
            try {
                const startTime = Date.now();
                // Simple request with bypass headers
                const response = await fetch(url, {
                    method: url.includes('fleettrackon') ? 'HEAD' : 'GET',
                    cache: 'no-store',
                    headers: { 'Bypass-Tunnel-Reminder': 'true' }
                });

                const latency = Date.now() - startTime;
                
                // Method 1: Get Date header (extremely reliable for main server)
                const dateHeader = response.headers.get('Date');
                if (dateHeader) {
                    return new Date(dateHeader).getTime() + (latency / 2);
                }

                // Method 2: Fallback to JSON payload if available
                if (response.ok && !url.includes('fleettrackon')) {
                    const data = await response.json();
                    const dateStr = data.datetime || data.dateTime;
                    if (dateStr) {
                        return new Date(dateStr).getTime() + (latency / 2);
                    }
                }
            } catch (e) {
                console.warn(`[TimeGuard] Time fetch failed for endpoint ${url}:`, e);
            }
        }
        return null;
    }

    /**
     * Compute and verify device clock offset against standard time
     */
    async function syncTime() {
        if (activeSyncPromise) return activeSyncPromise;

        activeSyncPromise = (async () => {
            const serverTime = await fetchServerTime();
            if (serverTime === null) {
                console.warn('[TimeGuard] Offline or server unreachable, skipping sync.');
                activeSyncPromise = null;
                return;
            }

            const deviceTime = Date.now();
            timeOffsetMs = serverTime - deviceTime;
            isOffsetSynced = true;
            console.log(`[TimeGuard] Time Offset synced: ${timeOffsetMs}ms (${(timeOffsetMs / 1000).toFixed(1)}s)`);

            // Verify and update security alerts/overlays
            checkSecurityConstraints();
            activeSyncPromise = null;
        })();

        return activeSyncPromise;
    }

    /**
     * Check timezone configuration
     * Indian standard offset is GMT+5:30 (-330 minutes)
     */
    function isIncorrectTimezone() {
        const tzOffset = new Date().getTimezoneOffset();
        const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        // Match either the correct GMT+5:30 offset or IANA Indian zone strings
        const isIndiaZone = tzOffset === -330 || (timeZoneName && (
            timeZoneName.includes('Kolkata') ||
            timeZoneName.includes('Calcutta') ||
            timeZoneName.includes('Mumbai')
        ));
        
        return !isIndiaZone;
    }

    /**
     * Evaluate anti-tamper conditions and render warnings or blocks
     */
    function checkSecurityConstraints() {
        const absOffset = Math.abs(timeOffsetMs);
        const incorrectTz = isIncorrectTimezone();

        // 1. Timezone Incorrect Warn
        if (incorrectTz) {
            showWarningBanner('Timezone Alert: Your device timezone is not set to India (GMT+5:30). Please update it in device settings.');
        } 
        // 2. Off by > 30 seconds warn
        else if (absOffset > SECONDS_30 && absOffset <= MINUTES_2) {
            const diffSecStr = (absOffset / 1000).toFixed(0);
            showWarningBanner(`Time Alert: Your device clock is off by ${diffSecStr} seconds. Please set time to Automatic.`);
        } 
        // Clear warning if all good
        else {
            hideWarningBanner();
        }

        // 3. Time difference > 2 minutes block
        if (absOffset > MINUTES_2) {
            const diffMinStr = (absOffset / 60000).toFixed(1);
            const serverTimeString = new Date(Date.now() + timeOffsetMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            showBlockingOverlay(`Security Block: Time Tampering Detected`, 
                `Your phone clock is incorrect by <strong>${diffMinStr} minutes</strong>. attendance, DSR, check-in, check-out, and reports are blocked for security.<br><br>Please set your device clock settings to <strong>Automatic / Network Provided Time</strong>.<br><br><strong>Current IST Time:</strong> ${serverTimeString}`);
        } else {
            hideBlockingOverlay();
        }
    }

    /**
     * Render non-intrusive warning banner at the top of screen
     */
    function showWarningBanner(msg) {
        if (!warningBannerEl) {
            warningBannerEl = document.createElement('div');
            warningBannerEl.id = 'time-guard-banner';
            warningBannerEl.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                padding: 10px 15px !important;
                background: rgba(245, 158, 11, 0.95) !important;
                border-bottom: 1.5px solid rgba(251, 191, 36, 0.8) !important;
                color: #FFFFFF !important;
                font-family: system-ui, -apple-system, sans-serif !important;
                font-size: 13px !important;
                font-weight: 700 !important;
                text-align: center !important;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3) !important;
                z-index: 999999 !important;
                backdrop-filter: blur(10px) !important;
                box-sizing: border-box !important;
                transition: transform 0.3s ease !important;
            `;
            document.body.appendChild(warningBannerEl);
            // Push body content down slightly if needed
            document.body.style.paddingTop = '40px';
        }
        warningBannerEl.innerText = msg;
    }

    function hideWarningBanner() {
        if (warningBannerEl) {
            warningBannerEl.remove();
            warningBannerEl = null;
            document.body.style.paddingTop = '0px';
        }
    }

    /**
     * Render premium glassmorphic overlay to block access completely
     */
    function showBlockingOverlay(title, description) {
        if (!blockingOverlayEl) {
            blockingOverlayEl = document.createElement('div');
            blockingOverlayEl.id = 'time-guard-overlay';
            blockingOverlayEl.style.cssText = `
                position: fixed !important;
                inset: 0 !important;
                width: 100% !important;
                height: 100% !important;
                background: rgba(5, 12, 24, 0.75) !important;
                backdrop-filter: blur(35px) saturate(200%) !important;
                -webkit-backdrop-filter: blur(35px) saturate(200%) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                z-index: 1000000 !important;
                font-family: system-ui, -apple-system, sans-serif !important;
                box-sizing: border-box !important;
                padding: 24px !important;
            `;

            const card = document.createElement('div');
            card.style.cssText = `
                max-width: 420px !important;
                width: 100% !important;
                background: rgba(10, 25, 47, 0.7) !important;
                border: none !important;
                border-top: 2px solid rgba(239, 68, 68, 0.6) !important;
                border-left: 1.5px solid rgba(239, 68, 68, 0.4) !important;
                border-bottom: 0.8px solid rgba(239, 68, 68, 0.1) !important;
                border-right: 0.8px solid rgba(239, 68, 68, 0.05) !important;
                border-radius: 28px !important;
                padding: 28px !important;
                box-shadow: 
                    0 0 35px rgba(239, 68, 68, 0.25),
                    inset 0 0 15px rgba(255, 255, 255, 0.1),
                    0 20px 40px rgba(0, 0, 0, 0.6) !important;
                text-align: center !important;
                color: #FFFFFF !important;
                box-sizing: border-box !important;
            `;

            const alertIcon = document.createElement('div');
            alertIcon.style.cssText = `
                width: 60px !important;
                height: 60px !important;
                border-radius: 50% !important;
                background: rgba(239, 68, 68, 0.15) !important;
                border: 1px solid rgba(239, 68, 68, 0.4) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                margin: 0 auto 20px auto !important;
                color: #EF4444 !important;
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.2) !important;
            `;
            alertIcon.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;

            const head = document.createElement('h3');
            head.id = 'time-guard-title';
            head.style.cssText = `
                margin: 0 0 14px 0 !important;
                font-size: 19px !important;
                font-weight: 800 !important;
                letter-spacing: -0.2px !important;
                color: #FFFFFF !important;
                text-shadow: 0 0 10px rgba(239, 68, 68, 0.3) !important;
            `;

            const desc = document.createElement('p');
            desc.id = 'time-guard-desc';
            desc.style.cssText = `
                margin: 0 0 24px 0 !important;
                font-size: 14.5px !important;
                line-height: 1.5 !important;
                color: #CBD5E1 !important;
            `;

            const retryBtn = document.createElement('button');
            retryBtn.innerText = 'Re-Verify Clock';
            retryBtn.style.cssText = `
                width: 100% !important;
                padding: 14px 20px !important;
                background: rgba(239, 68, 68, 0.25) !important;
                border: 1px solid rgba(239, 68, 68, 0.5) !important;
                border-radius: 16px !important;
                color: #FFFFFF !important;
                font-size: 14px !important;
                font-weight: 700 !important;
                cursor: pointer !important;
                transition: background 0.2s ease !important;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.1) !important;
            `;
            retryBtn.onmouseover = () => retryBtn.style.background = 'rgba(239, 68, 68, 0.35)';
            retryBtn.onmouseout = () => retryBtn.style.background = 'rgba(239, 68, 68, 0.25)';
            retryBtn.onclick = async () => {
                retryBtn.innerText = 'Verifying...';
                retryBtn.disabled = true;
                await syncTime();
                retryBtn.innerText = 'Re-Verify Clock';
                retryBtn.disabled = false;
            };

            card.appendChild(alertIcon);
            card.appendChild(head);
            card.appendChild(desc);
            card.appendChild(retryBtn);
            blockingOverlayEl.appendChild(card);
            document.body.appendChild(blockingOverlayEl);
        }

        document.getElementById('time-guard-title').innerText = title;
        document.getElementById('time-guard-desc').innerHTML = description;
    }

    function hideBlockingOverlay() {
        if (blockingOverlayEl) {
            blockingOverlayEl.remove();
            blockingOverlayEl = null;
        }
    }

    // ============================================================================
    // SECURITY INTERCEPTION LAYER (Capture phase click interception)
    // ============================================================================
    window.addEventListener('click', function (e) {
        if (isOffsetSynced && Math.abs(timeOffsetMs) > MINUTES_2) {
            const target = e.target;
            const isCriticalAction = target.closest && (
                target.closest('.btn-dsr') ||
                target.closest('.btn-booking') ||
                target.closest('#dsr-submit') ||
                target.closest('#day-start') ||
                target.closest('#day-end') ||
                target.closest('#card-check-in') ||
                target.closest('#card-check-out') ||
                target.closest('.btn-checkin') ||
                target.closest('.btn-checkout')
            );

            if (isCriticalAction) {
                e.preventDefault();
                e.stopPropagation();
                alert('Access Blocked: Your phone time/timezone is incorrect. Please enable "Set time automatically" in settings to unlock.');
            }
        }
    }, true); // Capture phase ensures this runs before existing page event listeners

    // ============================================================================
    // NETWORK INTERCEPTION LAYER (Global Fetch/XHR middleware blocking)
    // ============================================================================
    
    // 1. Fetch Interceptor
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const urlInput = args[0];
        const urlStr = typeof urlInput === 'string' ? urlInput : (urlInput && urlInput.url);

        if (urlStr && (
            urlStr.includes('/api/client/day-start') ||
            urlStr.includes('/api/client/day-end') ||
            urlStr.includes('/api/client/dsr-update') ||
            urlStr.includes('/iamatevent')
        )) {
            if (isOffsetSynced && Math.abs(timeOffsetMs) > MINUTES_2) {
                console.error(`[TimeGuard] Blocked fetch request to ${urlStr} due to time tampering.`);
                return Promise.reject(new Error('Time Tampering Block: attendance and DSR actions are disabled until device clock is correct.'));
            }
        }
        return originalFetch.apply(this, args);
    };

    // 2. XHR Interceptor
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        this._reqUrl = url;
        return originalOpen.call(this, method, url, ...args);
    };

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (...args) {
        if (this._reqUrl && (
            this._reqUrl.includes('/api/client/day-start') ||
            this._reqUrl.includes('/api/client/day-end') ||
            this._reqUrl.includes('/api/client/dsr-update') ||
            this._reqUrl.includes('/iamatevent')
        )) {
            if (isOffsetSynced && Math.abs(timeOffsetMs) > MINUTES_2) {
                console.error(`[TimeGuard] Blocked XHR request to ${this._reqUrl} due to time tampering.`);
                // Dispatch error callback safely
                const self = this;
                setTimeout(() => {
                    self.dispatchEvent(new Event('error'));
                }, 5);
                return;
            }
        }
        return originalSend.apply(this, args);
    };

    // ============================================================================
    // PUBLIC TIMEGUARD NAMESPACE
    // ============================================================================
    window.TimeGuard = {
        /**
         * Get authenticated date adjusted for device timezone drift
         */
        getSecureDate: function () {
            return new Date(Date.now() + timeOffsetMs);
        },

        getSecureTime: function () {
            return Date.now() + timeOffsetMs;
        },

        isTimeTampered: function () {
            return isOffsetSynced && Math.abs(timeOffsetMs) > MINUTES_2;
        },

        isWarnOffsetActive: function () {
            return isOffsetSynced && Math.abs(timeOffsetMs) > SECONDS_30;
        },

        getOffset: function () {
            return timeOffsetMs;
        },

        sync: syncTime
    };

    // Start background sync routine
    window.addEventListener('DOMContentLoaded', () => {
        // Initial sync
        syncTime();
        
        // Loop sync checks
        setInterval(syncTime, SYNC_INTERVAL);
    });

})();
