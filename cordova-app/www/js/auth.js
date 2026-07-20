/**
 * ============================================
 * Authentication Module
 * Handles client/admin login, registration, logout
 * ============================================
 */

// ── Device ID (populated by Cordova plugin or fallback) ──
let currentDeviceId = localStorage.getItem('manual_device_id')
    || localStorage.getItem('device_id')
    || '';

/**
 * Initialize device ID from Cordova plugin
 * Called after 'deviceready'
 */
function initDeviceId() {
    if (typeof device !== 'undefined' && device.uuid) {
        setCurrentDeviceId(device.uuid, 'cordova-device');
    } else if (typeof device !== 'undefined' && device.serial) {
        setCurrentDeviceId(device.serial, 'cordova-serial');
    } else if (!currentDeviceId) {
        setCurrentDeviceId('8a08f0e7a1114c63', 'browser-test-default');
    } else {
        populateDeviceIdFields();
    }

    if (window.AlarmBridge && typeof window.AlarmBridge.getDeviceId === 'function') {
        window.AlarmBridge.getDeviceId(
            (deviceId) => {
                if (deviceId) {
                    setCurrentDeviceId(deviceId, 'alarm-bridge');
                }
            },
            (err) => console.warn('[Auth] AlarmBridge device ID unavailable:', err)
        );
    }

    bindDeviceIdInputs();
    console.log('[Auth] Device ID:', currentDeviceId);
}

function setCurrentDeviceId(deviceId, source) {
    currentDeviceId = String(deviceId || '').trim();
    if (!currentDeviceId) return;

    localStorage.setItem('device_id', currentDeviceId);
    populateDeviceIdFields();
    console.log(`[Auth] Device ID (${source}):`, currentDeviceId);
}

function populateDeviceIdFields() {
    if (!currentDeviceId) return;

    const fields = [
        'client-device-id-input',
        'reg-device-id-input'
    ];

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = currentDeviceId;
    });
}

function bindDeviceIdInputs() {
    const fields = [
        'client-device-id-input',
        'reg-device-id-input'
    ];

    fields.forEach(id => {
        const el = document.getElementById(id);
        if (!el || el.dataset.boundDeviceId === 'true') return;

        el.dataset.boundDeviceId = 'true';
        el.addEventListener('input', () => {
            currentDeviceId = el.value.trim();
            localStorage.setItem('manual_device_id', currentDeviceId);
            populateDeviceIdFields();
        });
    });
}

/**
 * Switch between Client and Admin login tabs
 */
function switchLoginTab(tab) {
    const clientTab = document.getElementById('tab-client');
    const adminTab = document.getElementById('tab-admin');
    const clientForm = document.getElementById('client-login-form');
    const adminForm = document.getElementById('admin-login-form');
    const indicator = document.querySelector('.tab-indicator');

    if (tab === 'client') {
        clientTab.classList.add('active');
        adminTab.classList.remove('active');
        clientForm.classList.add('active');
        adminForm.classList.remove('active');
        indicator.classList.remove('right');
    } else {
        adminTab.classList.add('active');
        clientTab.classList.remove('active');
        adminForm.classList.add('active');
        clientForm.classList.remove('active');
        indicator.classList.add('right');
    }
}

/**
 * Handle Client Login
 */
async function handleClientLogin() {
    const clientId = document.getElementById('client-id-input').value.trim();
    const deviceId = document.getElementById('client-device-id-input').value.trim();
    const btn = document.getElementById('btn-client-login');

    // Validate
    if (!clientId) {
        showToast('Please enter your Client ID', 'error');
        document.getElementById('client-id-input').focus();
        return;
    }

    const registeredClientId = localStorage.getItem('registered_client_id');
    if (registeredClientId && registeredClientId !== clientId) {
        showToast('This device is already registered to another user. Clear app data in settings to register a new user.', 'error', 5000);
        return;
    }

    if (!deviceId) {
        showToast('Device ID not detected. Please wait or restart the app.', 'error');
        return;
    }

    // Loading state
    setButtonLoading(btn, true);

    try {
        // ── LOGIN DIRECTLY VIA SKYWAY RegisterDiaDevice API ──
        // No custom backend needed. Skyway validates UserId + GuId and returns user info.
        console.log('[Auth] Logging in via Skyway RegisterDiaDevice...');
        const rawText = await fetch(`${API_BASE_URL}/RegisterDiaDevice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ UserId: clientId, GuId: deviceId })
        }).then(r => r.text());

        console.log('[Auth] Skyway login raw response:', rawText);

        let skywayData = null;
        try {
            skywayData = JSON.parse(rawText);
        } catch (e) {
            if (rawText) skywayData = { output: [{ resstatus: rawText.trim() }] };
        }

        if (!skywayData || !skywayData.output || !skywayData.output[0]) {
            throw new Error('No response from server. Please check your internet connection.');
        }

        const info = skywayData.output[0];

        if (info.resstatus === 'Not Valid') {
            throw new Error('Invalid User ID or Device ID. Please contact your administrator.');
        }

        // Helper to extract field value dynamically regardless of casing
        function getDynamicField(obj, ...possibleKeys) {
            if (!obj || typeof obj !== 'object') return '';
            const keys = Object.keys(obj);
            for (const pKey of possibleKeys) {
                const target = pKey.toLowerCase();
                const found = keys.find(k => k.toLowerCase() === target);
                if (found && obj[found] !== null && obj[found] !== undefined) {
                    const str = String(obj[found]).trim();
                    if (str.length > 0) return str;
                }
            }
            return '';
        }

        const resolvedClientId = String(getDynamicField(info, 'userid', 'id') || clientId);
        const resolvedDeviceId = String(getDynamicField(info, 'imeinumber', 'imei', 'deviceid') || deviceId);

        // Dynamically extract user name from server response fields
        let resolvedName = getDynamicField(info, 'userfullname', 'user_fullname', 'fullname', 'userloginid', 'username', 'name');
        if (!resolvedName) {
            resolvedName = `Client ${resolvedClientId}`;
        }

        // Build client object from Skyway response
        const clientData = {
            clientId:   resolvedClientId,
            deviceId:   resolvedDeviceId,
            name:       resolvedName,
            userType:   getDynamicField(info, 'usertype', 'user_type', 'role') || 'client',
            clusters:   getDynamicField(info, 'clusters') || '',
            skywayInfo: info
        };

        // Save session locally (token not needed from custom backend)
        saveSession('skyway-direct', 'client', clientData);

        // Permanently lock the device to this client ID (cleared only via app data wipe in system settings)
        localStorage.setItem('registered_client_id', clientData.clientId);

        showToast('Logged in successfully!', 'success', 4000);
        setTimeout(() => { enterClientSession(clientData); }, 500);

    } catch (err) {
        showToast(err.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
        setButtonLoading(btn, false);
    }
}

/**
 * Handle Admin Login
 */
async function handleAdminLogin() {
    const adminId = document.getElementById('admin-id-input').value.trim();
    const password = document.getElementById('admin-password-input').value;
    const btn = document.getElementById('btn-admin-login');

    // Validate
    if (!adminId) {
        showToast('Please enter Admin ID', 'error');
        document.getElementById('admin-id-input').focus();
        return;
    }

    if (!password) {
        showToast('Please enter password', 'error');
        document.getElementById('admin-password-input').focus();
        return;
    }

    // Loading state
    setButtonLoading(btn, true);

    try {
        const response = await apiRequest('/api/admin/login', 'POST', {
            adminId: adminId,
            password: password
        });

        if (response.success) {
            // Save session
            saveSession(response.token, 'admin', response.admin);

            // Show success alert
            showToast('Admin has logged in successfully', 'success', 4000);

            // Navigate to admin dashboard
            setTimeout(() => {
                initAdminDashboard(response.admin);
                showView('admin-view');
            }, 500);
        }

    } catch (err) {
        showToast(err.message || 'Login failed. Invalid credentials.', 'error');
    } finally {
        setButtonLoading(btn, false);
    }
}

/**
 * Handle Client Registration
 */
async function handleRegister() {
    const name = document.getElementById('reg-name-input').value.trim();
    const deviceId = document.getElementById('reg-device-id-input').value.trim();
    const btn = document.getElementById('btn-register');

    if (!deviceId) {
        showToast('Device ID not detected. Please wait.', 'error');
        return;
    }

    setButtonLoading(btn, true);

    try {
        const response = await apiRequest('/api/client/register', 'POST', {
            deviceId: deviceId,
            name: name || undefined
        });

        if (response.success) {
            // Show success card
            document.getElementById('generated-client-id').textContent = response.clientId;
            document.getElementById('register-success').classList.remove('hidden');
            
            // Pre-fill client login
            document.getElementById('client-id-input').value = response.clientId;

            showToast('Registration successful!', 'success');
        }

    } catch (err) {
        if (err.status === 409) {
            // Device already registered
            showToast(`Device already registered as ${err.data?.clientId || 'unknown'}`, 'warning');
            if (err.data?.clientId) {
                document.getElementById('client-id-input').value = err.data.clientId;
            }
        } else {
            showToast(err.message || 'Registration failed.', 'error');
        }
    } finally {
        setButtonLoading(btn, false);
    }
}

/**
 * Handle Logout
 */
async function handleLogout() {
    const session = getSession();

    // Stop tracking if client
    if (session && session.role === 'client') {
        stopLocationTracking();

        // Clear workday state from localStorage on logout
        localStorage.removeItem('isDayStarted');
        localStorage.removeItem('isCheckedIn');

        try {
            await apiRequest('/api/client/logout', 'POST', {
                clientId: session.userData?.clientId
            });
        } catch (e) {
            // Ignore logout API errors
        }
    }

    // Stop admin auto-refresh
    if (typeof stopAdminAutoRefresh === 'function') {
        stopAdminAutoRefresh();
    }

    // Clear session
    clearSession();

    // Reset forms
    document.getElementById('client-id-input').value = '';
    document.getElementById('admin-id-input').value = '';
    document.getElementById('admin-password-input').value = '';

    showToast('Logged out successfully', 'info');
    showView('login-view');
}

/**
 * Toggle password visibility
 */
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.querySelector('span').textContent = 'HIDE';
    } else {
        input.type = 'password';
        btn.querySelector('span').textContent = 'VIEW';
    }
}

/**
 * Set button loading state
 */
function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    const text = btn.querySelector('.btn-text');
    const arrow = btn.querySelector('.btn-arrow');
    const loader = btn.querySelector('.btn-loader');

    if (isLoading) {
        btn.disabled = true;
        if (text) text.style.display = 'none';
        if (arrow) arrow.style.display = 'none';
        if (loader) loader.classList.remove('hidden');
    } else {
        btn.disabled = false;
        if (text) text.style.display = '';
        if (arrow) arrow.style.display = '';
        if (loader) loader.classList.add('hidden');
    }
}
