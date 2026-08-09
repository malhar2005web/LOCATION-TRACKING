/**
 * Dashboard Page Logic
 * Logout, settings dropdown & theme toggle
 */

function handleLogout() {
    showToast('Logging out...', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

/* ── Settings Dropdown ── */
function toggleSettingsDropdown(e) {
    e.stopPropagation();
    const menu = document.getElementById('settings-menu');
    menu.classList.toggle('open');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('settings-dropdown');
    const menu = document.getElementById('settings-menu');
    if (dropdown && menu && !dropdown.contains(e.target)) {
        menu.classList.remove('open');
    }
});

/* ── Theme Toggle ── */
function toggleTheme() {
    const isLight = document.getElementById('theme-toggle').checked;
    if (isLight) {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('portalTheme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('portalTheme', 'dark');
    }
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
    // Set admin name
    const adminName = localStorage.getItem('adminUser') || 'admin';
    const nameEl = document.getElementById('admin-name');
    if (nameEl) nameEl.textContent = adminName;

    // Restore saved theme
    const savedTheme = localStorage.getItem('portalTheme');
    const toggle = document.getElementById('theme-toggle');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        if (toggle) toggle.checked = true;
    }
});
