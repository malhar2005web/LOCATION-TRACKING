/**
 * Applied Leaves Logic
 * Dynamically fetches live applied leave records from API (getleavereport)
 */

const API_BASE_URL = 'https://fleettrackon.co.in/pcsdia';
let LEAVES_DATA = [];

/**
 * Format date string for display in applied leaves table
 */
function formatLeaveDate(dateVal, includeTime = true) {
    if (!dateVal || dateVal === '--') return '-';
    
    let dt = null;
    if (typeof dateVal === 'string') {
        if (dateVal.includes('T') || dateVal.endsWith('Z')) {
            dt = new Date(dateVal);
        } else if (dateVal.match(/^\d{4}[\/-]\d{2}[\/-]\d{2}/)) {
            const formattedIso = dateVal.replaceAll('/', '-').replace(' ', 'T') + 'Z';
            dt = new Date(formattedIso);
        }
    } else if (dateVal instanceof Date) {
        dt = dateVal;
    }

    if (!dt || isNaN(dt.getTime())) {
        return String(dateVal);
    }

    // Convert to IST (Asia/Kolkata GMT+5:30)
    const options = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    };
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = false;
    }

    const formatted = new Intl.DateTimeFormat('en-GB', options).format(dt);
    return formatted.replace(',', '');
}

/**
 * Fetch live applied leaves from API
 */
async function fetchAppliedLeavesFromApi() {
    const tbody = document.getElementById('leaves-tbody');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="14" style="text-align: center; padding: 36px; color: var(--text-sub);">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <svg style="animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                <span>Loading live applied leaves from server...</span>
            </div>
        </td></tr>`;
    }

    const userSelect = document.getElementById('search-user-select');
    const selectedUser = userSelect ? userSelect.value : 'demo group';
    const queryUser = (selectedUser === 'All' || !selectedUser) ? 'demo group' : selectedUser;

    try {
        console.log('[AppliedLeaves] Fetching getleavereport for user:', queryUser);
        const res = await fetch(`${API_BASE_URL}/getleavereport`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gempname: queryUser })
        });

        const data = await res.json();
        console.log('[AppliedLeaves] API response count:', data && data.trackerid ? data.trackerid.length : 0);

        const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

        LEAVES_DATA = records.map((row, i) => {
            const rawStatus = (row.status || 'PENDING').toUpperCase();
            return {
                srNo: String(row.id || i + 1),
                appliedOn: formatLeaveDate(row.daydate || row.currentdatetime, true),
                userName: row.name || row.empname || queryUser,
                department: row.department || 'Sales',
                empCode: row.empcode || `EMP00${row.id || i + 1}`,
                from: formatLeaveDate(row.requiredfrom, false),
                till: formatLeaveDate(row.tilltime || row.requiredtill, false),
                totalDays: String(row.totalleave || '1.0'),
                leaveType: row.leavetype || 'Casual Leave',
                dayType: row.fullhalf || 'Full Day',
                responsiblePerson: row.responsible || row.in_absence || '-',
                approvedBy: row.approvedby || (rawStatus === 'APPROVED' ? 'Admin User' : '-'),
                approvedOn: row.approvedon ? formatLeaveDate(row.approvedon, true) : '-',
                status: rawStatus
            };
        });

        filterAndRenderLeaves();
    } catch (err) {
        console.error('[AppliedLeaves] Failed to fetch live leaves:', err);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="14" style="text-align: center; padding: 24px; color: #ef4444;">Failed to load live leaves: ${err.message || 'Server error'}</td></tr>`;
        }
    }
}

function renderLeavesTable(data) {
    const tbody = document.getElementById('leaves-tbody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="14" class="empty-table-msg">No leave records found matching search parameters</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, i) => {
        let statusClass = 'status-approved';
        if (item.status === 'PENDING') statusClass = 'status-pending';
        if (item.status === 'REJECTED') statusClass = 'status-rejected';

        return `
            <tr>
                <td class="col-srno">${i + 1}</td>
                <td class="col-datetime">${item.appliedOn}</td>
                <td><strong>${item.userName}</strong></td>
                <td><span class="dept-badge">${item.department}</span></td>
                <td><code class="code-pan">${item.empCode}</code></td>
                <td class="col-datetime">${item.from}</td>
                <td class="col-datetime">${item.till}</td>
                <td><strong>${item.totalDays}</strong></td>
                <td><span class="leave-type-pill">${item.leaveType}</span></td>
                <td>${item.dayType}</td>
                <td>${item.responsiblePerson}</td>
                <td>${item.approvedBy}</td>
                <td class="col-datetime">${item.approvedOn}</td>
                <td><span class="status-badge ${statusClass}">${item.status}</span></td>
            </tr>
        `;
    }).join('');
}

function filterAndRenderLeaves() {
    const user = document.getElementById('search-user-select').value;
    const dept = document.getElementById('search-dept-select').value;

    let filtered = LEAVES_DATA;

    if (user !== 'All') {
        filtered = filtered.filter(item => item.userName.toLowerCase().includes(user.toLowerCase()));
    }

    if (dept !== 'All') {
        filtered = filtered.filter(item => item.department.toLowerCase() === dept.toLowerCase());
    }

    renderLeavesTable(filtered);
}

function generateLeavesReport() {
    const fromDate = document.getElementById('leaves-from-date').value;
    const tillDate = document.getElementById('leaves-till-date').value;
    const user = document.getElementById('search-user-select').value;
    const dept = document.getElementById('search-dept-select').value;

    // Update report meta
    const metaRange = document.getElementById('leaves-meta-range');
    const metaDate = document.getElementById('leaves-meta-date');

    if (metaRange && fromDate && tillDate) {
        metaRange.textContent = `${fromDate.replace(/-/g,'/')} - ${tillDate.replace(/-/g,'/')}`;
    }

    if (metaDate) {
        const now = new Date();
        metaDate.textContent = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    // Refetch from API if user changed, or filter local state
    fetchAppliedLeavesFromApi();
    showToast(`Generated report for "${user}" (${dept} department)`, 'success');
}

// Initialize dates and fetch from API on page load
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    const fromInput = document.getElementById('leaves-from-date');
    const tillInput = document.getElementById('leaves-till-date');

    if (fromInput) fromInput.value = firstDay;
    if (tillInput) tillInput.value = todayStr;

    fetchAppliedLeavesFromApi();
});
