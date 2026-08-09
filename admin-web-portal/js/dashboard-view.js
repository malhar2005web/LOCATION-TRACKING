/**
 * Dashboard View Logic
 * User search filtering and visual table rendering
 */

const DASHBOARD_DATA = [
    {
        srNo: '1',
        userName: 'demo group',
        userInitials: 'DG',
        avatarColor: '#3B82F6',
        gpsDateTime: '2026/08/08 12:49',
        speed: '0',
        location: '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051'
    },
    {
        srNo: '2',
        userName: 'Paresh',
        userInitials: 'P',
        avatarColor: '#8B5CF6',
        gpsDateTime: '2026/07/31 13:44',
        speed: '0',
        location: '0.41 Km from : Mankivali, Badlapur-E, Mumbai, Maharashtra'
    }
];

function renderDashboardTable(data) {
    const tbody = document.getElementById('dashboard-tbody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-table-msg">No user location records found matching search query</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td class="col-srno">${item.srNo}</td>
            <td class="col-username">
                <div class="user-cell">
                    <span class="user-avatar" style="--av-bg: ${item.avatarColor}">${item.userInitials}</span>
                    <span class="user-name-text">${item.userName}</span>
                </div>
            </td>
            <td class="col-datetime">
                <div class="datetime-cell">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>${item.gpsDateTime}</span>
                </div>
            </td>
            <td class="col-speed">
                <span class="speed-badge">${item.speed} km/h</span>
            </td>
            <td class="col-location">
                <div class="location-cell">
                    <svg class="loc-pin-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>${item.location}</span>
                </div>
            </td>
        </tr>
    `).join('');

    // Update count in metric card
    const countEl = document.getElementById('val-total-users');
    if (countEl) countEl.textContent = `${data.length} Active`;
}

function filterDashboard() {
    const query = document.getElementById('dash-search-user').value.trim().toLowerCase();
    if (!query) {
        renderDashboardTable(DASHBOARD_DATA);
        showToast('Showing all dashboard records', 'success');
        return;
    }

    const filtered = DASHBOARD_DATA.filter(item => item.userName.toLowerCase().includes(query));
    renderDashboardTable(filtered);
    showToast(`Found ${filtered.length} record(s) for "${query}"`, 'success');
}

function clearDashboardSearch() {
    const input = document.getElementById('dash-search-user');
    if (input) input.value = '';
    renderDashboardTable(DASHBOARD_DATA);
    showToast('Search reset to all records', 'success');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderDashboardTable(DASHBOARD_DATA);
});
