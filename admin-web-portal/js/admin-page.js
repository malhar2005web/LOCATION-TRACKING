/**
 * Admin Security Page Logic
 * Password verification modal handler
 */

function handleVerifyAdminPassword(e) {
    e.preventDefault();

    const password = document.getElementById('sec-password').value.trim();

    if (!password) {
        showToast('Please enter the admin security password.', 'error');
        return;
    }

    // Close password modal
    const modal = document.getElementById('admin-pass-modal');
    if (modal) modal.classList.remove('open');

    // Show unlocked view
    const unlockedView = document.getElementById('admin-unlocked-view');
    if (unlockedView) unlockedView.style.display = 'block';

    showToast('Admin password verified! Configuration unlocked.', 'success');
}

// Focus password input on page load
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('sec-password');
    if (input) setTimeout(() => input.focus(), 200);
});
