/**
 * FleetTrackOn Admin Portal Logic
 * Tab switching & authentication handlers
 */

function switchTab(role) {
    const tabAdmin = document.getElementById('tab-admin');
    const tabClient = document.getElementById('tab-client');
    const adminForm = document.getElementById('admin-form');
    const clientForm = document.getElementById('client-form');

    if (role === 'admin') {
        tabAdmin.classList.add('active');
        tabClient.classList.remove('active');
        adminForm.classList.add('active');
        clientForm.classList.remove('active');
    } else {
        tabClient.classList.add('active');
        tabAdmin.classList.remove('active');
        clientForm.classList.add('active');
        adminForm.classList.remove('active');
    }
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
    } else {
        input.type = 'password';
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✓' : '⚠️'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function handleAdminLogin() {
    const username = document.getElementById('admin-id').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    // Seed credentials
    const SEED_USER = 'admin';
    const SEED_PASS = 'pcs@2026';

    if (!username || !password) {
        showToast('Please enter both Admin ID and Password.', 'error');
        return;
    }

    if (username !== SEED_USER || password !== SEED_PASS) {
        showToast('Invalid credentials. Please try again.', 'error');
        return;
    }

    showToast('Admin login successful! Redirecting...', 'success');
    localStorage.setItem('adminUser', username);
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

function handleClientLogin() {
    const name = document.getElementById('client-name').value.trim();
    const deviceId = document.getElementById('client-device-id').value.trim();

    if (!name) {
        showToast('Please enter your Staff Name or ID.', 'error');
        return;
    }

    showToast(`Staff login successful! Welcome ${name}.`, 'success');
    console.log('[Staff Login]', { name, deviceId });
}
