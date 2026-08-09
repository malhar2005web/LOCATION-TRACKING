/**
 * Reports Page Logic
 * Tab switching with dynamic table rendering per report type
 */

/* ── Report Definitions ── */
const REPORTS = {
    'travel-path': {
        title: 'TRAVEL PATH',
        columns: ['SRNO', 'USER NAME', 'LOCATION', 'ADDRESS', 'TRACKDATE', 'SPEED', 'ISGPS'],
        rows: [
            ['1', 'demo group', '18.4748192, 73.8119405', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '08/08/2026 00:00', '0', 'GPS FIX'],
            ['2', 'demo group', '18.4748192, 73.8119405', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '08/08/2026 00:01', '0', 'GPS FIX'],
            ['3', 'demo group', '18.4748192, 73.8119405', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '08/08/2026 00:02', '0', 'GPS FIX'],
            ['4', 'demo group', '18.4748192, 73.8119405', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '08/08/2026 00:03', '0', 'GPS FIX'],
            ['5', 'demo group', '18.4748101, 73.8119293', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '08/08/2026 00:04', '0', 'GPS FIX'],
            ['6', 'demo group', '18.4748101, 73.8119293', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '08/08/2026 00:05', '0', 'GPS FIX'],
            ['7', 'demo group', '18.4748101, 73.8119293', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '08/08/2026 00:06', '0', 'GPS FIX'],
            ['8', 'demo group', '18.4748101, 73.8119293', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '08/08/2026 00:07', '0', 'GPS FIX'],
        ]
    },
    'dsr-summary': {
        title: 'DSR SUMMARY REPORT',
        columns: ['SR NO', 'CLIENT NAME', 'SITE NAME', 'VISITED FOR', 'ASSIGNED TO', 'NO OF VISIT'],
        rows: [
            ['1', 'PIONEER HOUSING', 'Head Office', 'Sales Meeting', 'demo group', '3'],
            ['2', 'TATA MOTORS', 'Pune Branch', 'Product Demo', 'demo group', '2'],
            ['3', 'INFOSYS LTD', 'Hinjewadi Campus', 'Service Follow-up', 'demo group', '1'],
        ]
    },
    'checkin-status': {
        title: 'CHECK IN/OUT STATUS',
        columns: ['SR NO', 'USER_NAME', 'CHECKIN', 'IN LOCATION', 'IN LATLONG', 'CHECKOUT', 'OUT LOCATION', 'IN LATLONG', 'DURATION'],
        rows: [
            ['1', 'demo group', '08/08/2026 06:40', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056,73.8119057', '08/08/2026 06:40', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056,73.8119057', 'hrs:0 mins:0'],
            ['2', 'demo group', '08/08/2026 06:41', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056,73.8119057', '08/08/2026 06:42', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748134,73.8119249', 'hrs:0 mins:1'],
            ['3', 'demo group', '08/08/2026 06:42', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748134,73.8119249', '08/08/2026 06:42', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748134,73.8119249', 'hrs:0 mins:0'],
            ['4', 'demo group', '08/08/2026 06:43', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748134,73.8119249', '08/08/2026 07:03', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748181,73.8119381', 'hrs:0 mins:20'],
            ['5', 'demo group', '08/08/2026 07:03', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748181,73.8119381', '08/08/2026 07:05', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748093,73.8119127', 'hrs:0 mins:2'],
            ['6', 'demo group', '08/08/2026 07:05', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748093,73.8119127', '08/08/2026 10:21', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748197,73.8119334', 'hrs:3 mins:16'],
        ]
    },
    'day-end-summary': {
        title: 'DAY END SUMMARY 2',
        columns: ['SRNO', 'EMPNAME', 'DATED', 'START', 'IN', 'DSR', 'OUT', 'END', 'DURATION', 'ACTIVITY', 'CLIENT', 'LOCATION', 'LATLONG'],
        rows: [
            ['84', 'demo group', '08/08/2026 06:40', '06:40:00', '', '', '', '', '', 'START', '', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056, 73.8119057'],
            ['85', 'demo group', '08/08/2026 06:40', '', '06:40:35', '', '', '', '', 'CHECKIN', '', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056, 73.8119057'],
            ['86', 'demo group', '08/08/2026 06:40', '', '', '06:40:44', '', '', '', 'DSR_UPDATE', 'PIONEER HOUSING', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056, 73.8119057'],
            ['87', 'demo group', '08/08/2026 06:41', '', '', '', '06:41:00', '', '0:0:25', 'CHECKOUT', '', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056, 73.8119057'],
            ['88', 'demo group', '08/08/2026 06:41', '', '', '', '', '06:41:00', '0 Hrs 1 Min', 'END', '', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056, 73.8119057'],
            ['89', 'demo group', '08/08/2026 06:41', '', '06:41:15', '', '', '', '', 'CHECKIN', '', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '18.4748056, 73.8119057'],
        ]
    },
    'day-start-end': {
        title: 'START/END DAY REPORT',
        columns: ['SRNO', 'EMPNAME', 'STARTENDTIME', 'RECEIVEDON', 'START/END', 'LOCATION', 'STARTENDTIME', 'RECEIVEDON', 'START/END', 'LOCATION', 'DURATION'],
        rows: [
            ['1', 'demo group', '2026/08/08 06:40', '2026/08/08 12:10', 'START', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '2026/08/08 06:41', '2026/08/08 12:11', 'CHECKOUT', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '01 min'],
            ['2', 'demo group', '2026/08/08 06:41', '2026/08/08 12:11', 'END', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '2026/08/08 06:42', '2026/08/08 12:12', 'START', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '01 min'],
            ['3', 'demo group', '2026/08/08 06:43', '2026/08/08 12:13', 'CHECKOUT', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '2026/08/08 06:47', '2026/08/08 12:17', 'END', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '04 min'],
            ['4', 'demo group', '2026/08/08 07:03', '2026/08/08 12:33', 'START', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '2026/08/08 07:04', '2026/08/08 12:34', 'CHECKOUT', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '01 min'],
            ['5', 'demo group', '2026/08/08 07:04', '2026/08/08 12:34', 'END', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '2026/08/08 07:05', '2026/08/08 12:35', 'START', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '01 min'],
            ['6', 'demo group', '2026/08/08 07:06', '2026/08/08 12:36', 'CHECKOUT', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '2026/08/08 07:07', '2026/08/08 12:37', 'END', '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune, Maharashtra 411051', '01 min'],
        ]
    }
};

/* Activity badge mapping */
const ACTIVITY_BADGES = {
    'START': 'start',
    'CHECKIN': 'checkin',
    'DSR_UPDATE': 'dsr',
    'CHECKOUT': 'checkout',
    'END': 'end'
};

let currentTab = 'day-end-summary';

/* ── Render Table ── */
function renderReport(tabId) {
    const report = REPORTS[tabId];
    if (!report) return;

    // Update title
    const titleEl = document.getElementById('report-title');
    if (titleEl) titleEl.textContent = report.title;

    // Build thead
    const thead = document.querySelector('#report-table thead tr');
    thead.innerHTML = report.columns.map(col => `<th>${col}</th>`).join('');

    // Build tbody
    const tbody = document.getElementById('report-tbody');
    tbody.innerHTML = report.rows.map(row => {
        const cells = row.map((cell, i) => {
            // Check if this is an ACTIVITY column for day-end-summary
            const colName = report.columns[i];
            if ((colName === 'ACTIVITY' || colName === 'START/END') && ACTIVITY_BADGES[cell]) {
                return `<td><span class="activity-badge ${ACTIVITY_BADGES[cell]}">${cell}</span></td>`;
            }
            // ISGPS column badge
            if (colName === 'ISGPS' && cell) {
                return `<td><span class="activity-badge checkin">${cell}</span></td>`;
            }
            return `<td>${cell}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
}

/* ── Tab Switching ── */
function switchReportTab(tabId, btn) {
    currentTab = tabId;

    // Update active tab button
    document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // Render new table
    renderReport(tabId);
}

/* ── Search ── */
function searchReport() {
    const user = document.getElementById('search-user').value;
    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;
    const fromTime = document.getElementById('from-time').value;
    const toTime = document.getElementById('to-time').value;

    // Update report meta
    const rangeEl = document.getElementById('report-range');
    const dateEl = document.getElementById('report-date');

    if (rangeEl) {
        rangeEl.textContent = `${fromDate} ${fromTime} - ${toDate} ${toTime}`;
    }
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    showToast(`Searching reports for "${user || 'all users'}"...`, 'success');
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const fromDate = document.getElementById('from-date');
    const toDate = document.getElementById('to-date');
    if (fromDate) fromDate.value = today;
    if (toDate) toDate.value = today;

    // Render default tab
    renderReport(currentTab);
});
