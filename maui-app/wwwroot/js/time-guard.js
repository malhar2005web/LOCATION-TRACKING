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
    const MINUTES_10 = 10 * 60 * 1000;
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
    /**
     * Fetch time from a single endpoint via Date header
     * Returns: { time: epoch_ms, source: string } or null
     */
    async function fetchTimeFromEndpoint(url, label) {
        try {
            const startTime = Date.now();
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(url, {
                method: 'HEAD',
                cache: 'no-store',
                signal: controller.signal,
                headers: { 'Bypass-Tunnel-Reminder': 'true' }
            });
            clearTimeout(timeout);

            const latency = Date.now() - startTime;
            const dateHeader = response.headers.get('Date');
            if (dateHeader) {
                const serverMs = new Date(dateHeader).getTime();
                if (!isNaN(serverMs) && serverMs > 0) {
                    const corrected = serverMs + (latency / 2);
                    console.log(`[TimeGuard] ${label}: ${new Date(corrected).toISOString()} (latency ${latency}ms)`);
                    return { time: corrected, source: label };
                }
            }
        } catch (e) {
            console.warn(`[TimeGuard] ${label} failed:`, e.message || e);
        }
        return null;
    }

    /**
     * Fetch server time using multiple reliable sources with cross-validation.
     * Uses Date headers from well-known servers (Google, Cloudflare, own API).
     * Requires consensus: if sources disagree by > 2 min, returns null (safe fallback).
     * Returns: epoch milliseconds or null on failure/disagreement.
     */
    async function fetchServerTime() {
        const sources = [
            { url: window.API_BASE_URL || 'https://fleettrackon.co.in/pcsdia', label: 'FleetTrackOn' },
            { url: 'https://www.google.com/generate_204', label: 'Google' },
            { url: 'https://cloudflare.com/cdn-cgi/trace', label: 'Cloudflare' }
        ];

        // Fire all requests in parallel for speed
        const results = await Promise.all(
            sources.map(s => fetchTimeFromEndpoint(s.url, s.label))
        );

        const validResults = results.filter(r => r !== null);
        console.log(`[TimeGuard] Got ${validResults.length}/${sources.length} time sources`);

        if (validResults.length === 0) {
            console.warn('[TimeGuard] No time sources responded');
            return null;
        }

        // Single source: trust it only if it's Google or Cloudflare (highly reliable)
        if (validResults.length === 1) {
            const r = validResults[0];
            if (r.source === 'Google' || r.source === 'Cloudflare') {
                return r.time;
            }
            // Single unreliable source — don't block the user
            console.warn(`[TimeGuard] Only ${r.source} responded, skipping enforcement`);
            return null;
        }

        // Multiple sources: cross-validate (sources must agree within 2 minutes)
        const TWO_MINUTES = 2 * 60 * 1000;
        const times = validResults.map(r => r.time);
        const median = times.sort((a, b) => a - b)[Math.floor(times.length / 2)];
        
        // Check if all sources agree with the median within 2 min
        const agreeing = validResults.filter(r => Math.abs(r.time - median) < TWO_MINUTES);
        
        if (agreeing.length >= 2) {
            // Use average of agreeing sources for best accuracy
            const avg = agreeing.reduce((sum, r) => sum + r.time, 0) / agreeing.length;
            console.log(`[TimeGuard] Consensus time from ${agreeing.length} sources: ${new Date(avg).toISOString()}`);
            return avg;
        }

        // Sources disagree badly — one of them is wrong, don't block user
        console.warn('[TimeGuard] Time sources disagree, skipping enforcement');
        validResults.forEach(r => console.warn(`  ${r.source}: ${new Date(r.time).toISOString()}`));
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
     */    function checkSecurityConstraints() {
        const absOffset = Math.abs(timeOffsetMs);
        const incorrectTz = isIncorrectTimezone();

        if (incorrectTz) {
            showBlockingOverlay(`Security Block: Incorrect Timezone`, 
                `Your phone timezone is incorrect. attendance, DSR, check-in, check-out, and reports are blocked for security.<br><br>Please set your device timezone settings to <strong>India Standard Time (GMT+5:30) / Asia/Kolkata</strong>.`);
        } else if (absOffset > MINUTES_10) {
            const diffMinStr = (absOffset / 60000).toFixed(1);
            const serverTimeString = new Date(Date.now() + timeOffsetMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            showBlockingOverlay(`Security Block: Time Tampering Detected`, 
                `Your phone clock is incorrect by <strong>${diffMinStr} minutes</strong>. attendance, DSR, check-in, check-out, and reports are blocked for security.<br><br>Please set your device clock settings to <strong>Automatic / Network Provided Time</strong>.<br><br><strong>Current IST Time:</strong> ${serverTimeString}`);
        } else {
            hideBlockingOverlay();
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
        if (isOffsetSynced && Math.abs(timeOffsetMs) > MINUTES_10) {
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
            if (isOffsetSynced && Math.abs(timeOffsetMs) > MINUTES_10) {
                console.error(`[TimeGuard] Blocked fetch request to ${urlStr} due to time tampering.`);
                return Promise.reject(new Error('Time Tampering Block: attendance and DSR actions are disabled until device clock is correct.'));
            }
        }
        return originalFetch.apply(this, args);
    };
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
            if (isOffsetSynced && Math.abs(timeOffsetMs) > MINUTES_10) {
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
            return isOffsetSynced && Math.abs(timeOffsetMs) > MINUTES_10;
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
