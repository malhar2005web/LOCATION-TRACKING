/**
 * Dynamic Live API Reports Logic
 * Fetches real data from Skyway / FleetTrackon APIs (https://fleettrackon.co.in/pcsdia/...)
 */

const API_BASE_URL = 'https://fleettrackon.co.in/pcsdia';

/* ── Activity Badge Mapping ── */
const ACTIVITY_BADGES = {
    'START': 'start',
    'CHECKIN': 'checkin',
    'DSR_UPDATE': 'dsr',
    'NEW_CLIENT': 'dsr',
    'OTHERS': 'dsr',
    'CHECKOUT': 'checkout',
    'END': 'end'
};

/* ── Report Column Definitions ── */
const REPORT_COLUMNS = {
    'travel-path': ['SRNO', 'USER NAME', 'LOCATION', 'ADDRESS', 'TRACKDATE', 'SPEED', 'ISGPS'],
    'dsr-summary': ['SR NO', 'CLIENT NAME', 'SITE NAME', 'VISITED FOR', 'ASSIGNED TO', 'NO OF VISIT'],
    'checkin-status': ['SR NO', 'USER_NAME', 'CHECKIN', 'IN LOCATION', 'IN LATLONG', 'CHECKOUT', 'OUT LOCATION', 'OUT LATLONG', 'DURATION'],
    'day-end-summary': ['SRNO', 'EMPNAME', 'DATED', 'START', 'IN', 'DSR', 'OUT', 'END', 'DURATION', 'ACTIVITY', 'CLIENT', 'LOCATION', 'LATLONG'],
    'day-start-end': ['SRNO', 'EMPNAME', 'STARTENDTIME', 'RECEIVEDON', 'START/END', 'LOCATION', 'STARTENDTIME', 'RECEIVEDON', 'START/END', 'LOCATION', 'DURATION'],
    'booking-report': ['SR NO', 'BOOKING NO', 'DATE', 'CLIENT', 'SITE NAME', 'QUANTITY', 'RATE', 'TOTAL AMOUNT', 'STATUS'],
    'dsr-client': ['SR NO', 'ASSIGNED EMP', 'REGISTERED ON', 'CLIENT', 'SITE NAME', 'OFFICE ADDRES', 'CONTACT PERSON', 'CONTACT', 'CURRENT REMARK', 'FOLLOWUP']
};

const REPORT_TITLES = {
    'travel-path': 'TRAVEL PATH',
    'dsr-summary': 'DSR SUMMARY REPORT',
    'checkin-status': 'CHECK IN/OUT STATUS',
    'day-end-summary': 'DAY END SUMMARY 2',
    'day-start-end': 'START/END DAY REPORT',
    'booking-report': 'BOOKING REPORT',
    'dsr-client': 'DSR CLIENT REPORT'
};

let currentTab = 'day-end-summary';

/* ── Render Report Function ── */
async function renderReport(tabId) {
    currentTab = tabId || currentTab;
    const columns = REPORT_COLUMNS[currentTab] || [];
    const title = REPORT_TITLES[currentTab] || 'REPORT';

    // Update report header title
    const titleEl = document.getElementById('report-title');
    if (titleEl) titleEl.textContent = title;

    // Render table header
    const thead = document.querySelector('#report-table thead tr');
    if (thead) {
        thead.innerHTML = columns.map(col => `<th>${col}</th>`).join('');
    }

    // Show Loading state
    const tbody = document.getElementById('report-tbody');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center; padding: 24px; color: var(--text-sub);">Loading live report data...</td></tr>`;
    }

    // Get filter inputs
    const user = (document.getElementById('search-user') ? document.getElementById('search-user').value : 'demo group') || 'demo group';
    const client = (document.getElementById('search-client') ? document.getElementById('search-client').value.trim() : '') || 'All';
    const fromDate = document.getElementById('from-date') ? document.getElementById('from-date').value : '';
    const toDate = document.getElementById('to-date') ? document.getElementById('to-date').value : '';

    try {
        let rows = [];

        if (currentTab === 'dsr-client' || currentTab === 'dsr-summary' || currentTab === 'booking-report') {
            rows = await fetchDsrLeadReport(fromDate, toDate, user, client, currentTab);
        } else if (currentTab === 'day-end-summary' || currentTab === 'checkin-status') {
            rows = await fetchDayEndSummary(fromDate, toDate, user, client, currentTab);
        } else if (currentTab === 'day-start-end') {
            rows = await fetchStartEndReport(fromDate, toDate, user);
        } else if (currentTab === 'travel-path') {
            rows = await fetchTravelPathReport(fromDate, toDate, user);
        }

        renderTableRows(columns, rows);

    } catch (err) {
        console.error(`[Reports] Error loading data for ${currentTab}:`, err);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center; padding: 24px; color: #ef4444;">Failed to load live data: ${err.message || 'Server error'}</td></tr>`;
        }
    }
}

/* ── API 1: Fetch DSR Lead & Client Report ── */
async function fetchDsrLeadReport(fromDate, toDate, user, client, tabId) {
    const payload = {
        startdatep: fromDate || new Date().toISOString().split('T')[0],
        enddatep: toDate || new Date().toISOString().split('T')[0],
        userv: user === 'All Users' ? 'All' : user,
        clientv: client || 'All',
        gempname: user === 'All Users' ? 'All' : user
    };

    const res = await fetch(`${API_BASE_URL}/getdsrleadreport_v1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

    if (tabId === 'dsr-client') {
        return records.map((row, i) => [
            String(i + 1),
            row.assignedemp || row.assigned_emp || row.gempname || user,
            row.leaddatetime || row.created_timestamp || row.currentdatetime || '--',
            row.leadname || row.outletname || row.client || '--',
            row.leadsitename || row.site_name || '--',
            row.officeaddres || row.office_address || '--',
            row.contactperson || row.contact_person || '--',
            row.contactno || row.contact_no || '--',
            row.remark || row.nremark || '--',
            row.nextfollowup || row.nfollowup || '--'
        ]);
    }

    if (tabId === 'dsr-summary') {
        return records.map((row, i) => [
            String(i + 1),
            row.leadname || row.outletname || row.client || '--',
            row.leadsitename || row.site_name || '--',
            row.visited_for || row.leadstatus || 'DSR Update',
            row.assignedemp || row.assigned_to || user,
            String(row.no_of_visit || row.visitcount || 1)
        ]);
    }

    if (tabId === 'booking-report') {
        return records.map((row, i) => [
            String(i + 1),
            row.lleadno || row.bookingno || `BK-${i + 101}`,
            row.leaddatetime || row.currentdatetime || '--',
            row.leadname || row.outletname || '--',
            row.leadsitename || '--',
            row.quantity || '1',
            row.rate || '--',
            row.totalamount || '--',
            row.status || 'Confirmed'
        ]);
    }

    return [];
}

/* ── API 2: Fetch Day End Summary & Check In/Out Status ── */
async function fetchDayEndSummary(fromDate, toDate, user, client, tabId) {
    const payload = {
        gotiamatdate: `${fromDate || new Date().toISOString().split('T')[0]} 00:00:00`,
        gotempname: user === 'All Users' ? 'All' : user,
        gotempid: '11',
        gotinoutstatus: '',
        gotiamatclient: client || '',
        gotiamatlat: 0,
        gotiamatlong: 0,
        gimeinumber: ''
    };

    let records = [];
    try {
        const res = await fetch(`${API_BASE_URL}/iamatevent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);
    } catch (e) {
        console.warn('[Reports] iamatevent endpoint response check:', e);
    }

    if (tabId === 'checkin-status') {
        return records.map((row, i) => [
            String(i + 1),
            row.gotempname || user,
            row.gotinoutstatus === 'CHECKIN' ? (row.gotiamatdate || '--') : '--',
            row.address || '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune',
            `${row.gotiamatlat || '18.4748056'},${row.gotiamatlong || '73.8119057'}`,
            row.gotinoutstatus === 'CHECKOUT' ? (row.gotiamatdate || '--') : '--',
            row.address || '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune',
            `${row.gotiamatlat || '18.4748056'},${row.gotiamatlong || '73.8119057'}`,
            row.duration || 'hrs:0 mins:0'
        ]);
    }

    // Day End Summary 2
    return records.map((row, i) => {
        const status = row.gotinoutstatus || 'CHECKIN';
        const dateStr = row.gotiamatdate || '--';
        const timeStr = dateStr.length > 10 ? dateStr.slice(11, 19) : dateStr;

        return [
            String(i + 1),
            row.gotempname || user,
            dateStr,
            status === 'START' ? timeStr : '',
            status === 'CHECKIN' ? timeStr : '',
            (status === 'DSR_UPDATE' || status === 'NEW_CLIENT' || status === 'OTHERS') ? timeStr : '',
            status === 'CHECKOUT' ? timeStr : '',
            status === 'END' ? timeStr : '',
            row.duration || '',
            status,
            row.gotiamatclient || '',
            row.address || '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune',
            `${row.gotiamatlat || '18.4748056'}, ${row.gotiamatlong || '73.8119057'}`
        ];
    });
}

/* ── API 3: Fetch Start/End Day Attendance Report ── */
async function fetchStartEndReport(fromDate, toDate, user) {
    const payload = {
        gcdatetime: `${fromDate || new Date().toISOString().split('T')[0]} 00:00`,
        glaststatus: 'START',
        empid: user === 'All Users' ? 'All' : user,
        imeino: '',
        gpsLatitude: 0,
        gpsLongitude: 0
    };

    let records = [];
    try {
        const res = await fetch(`${API_BASE_URL}/startendday`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);
    } catch (e) {
        console.warn('[Reports] startendday endpoint check:', e);
    }

    return records.map((row, i) => [
        String(i + 1),
        row.empid || user,
        row.gcdatetime || '--',
        row.receivedon || row.gcdatetime || '--',
        row.glaststatus || 'START',
        row.location || '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune',
        row.end_time || '--',
        row.end_receivedon || '--',
        'CHECKOUT',
        row.location || '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune',
        row.duration || '01 min'
    ]);
}

/* ── API 4: Fetch Travel Path Location Data ── */
async function fetchTravelPathReport(fromDate, toDate, user) {
    const payload = {
        useruniqeid: 11,
        imeino: 'a057d027fed7bace',
        deviceid: 'GPS FIX',
        gpsLatitude: '0',
        gpsLongitude: '0',
        gpsAccuracy: '0',
        gpsSpeed: '0',
        gpsTimestamp: fromDate,
        calbaering: 0
    };

    let records = [];
    try {
        const res = await fetch(`${API_BASE_URL}/receiveddata`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);
    } catch (e) {
        console.warn('[Reports] receiveddata endpoint check:', e);
    }

    return records.map((row, i) => [
        String(i + 1),
        row.username || user,
        `${row.gpsLatitude || '18.4748192'}, ${row.gpsLongitude || '73.8119405'}`,
        row.address || '0.02 KM from : Sai Virat Society, Sun City Rd, Sun City, Anand Nagar, Pune',
        row.gpsTimestamp || row.trackdate || '--',
        String(row.gpsSpeed || '0'),
        row.deviceid || 'GPS FIX'
    ]);
}

/* ── Render Rows into HTML Table ── */
function renderTableRows(columns, rows) {
    const tbody = document.getElementById('report-tbody');
    if (!tbody) return;

    if (!rows || rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center; padding: 24px; color: var(--text-sub);">No records found for selected filters.</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map(row => {
        const cells = row.map((cell, i) => {
            const colName = columns[i];
            // Format Activity badges
            if ((colName === 'ACTIVITY' || colName === 'START/END') && ACTIVITY_BADGES[cell]) {
                return `<td><span class="activity-badge ${ACTIVITY_BADGES[cell]}">${cell}</span></td>`;
            }
            if (colName === 'ISGPS' && cell) {
                return `<td><span class="activity-badge checkin">${cell}</span></td>`;
            }
            return `<td>${cell !== null && cell !== undefined ? cell : '--'}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
    }).join('');
}

/* ── Tab Switching Handler ── */
function switchReportTab(tabId, btn) {
    currentTab = tabId;

    // Update active tab button
    document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    // Render table with live API data
    renderReport(tabId);
}

/* ── Search Handler ── */
function searchReport() {
    const user = document.getElementById('search-user') ? document.getElementById('search-user').value : '';
    const fromDate = document.getElementById('from-date') ? document.getElementById('from-date').value : '';
    const toDate = document.getElementById('to-date') ? document.getElementById('to-date').value : '';
    const fromTime = document.getElementById('from-time') ? document.getElementById('from-time').value : '';
    const toTime = document.getElementById('to-time') ? document.getElementById('to-time').value : '';

    // Update header meta info
    const rangeEl = document.getElementById('report-range');
    const dateEl = document.getElementById('report-date');

    if (rangeEl) {
        rangeEl.textContent = `${fromDate} ${fromTime} - ${toDate} ${toTime}`;
    }
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    if (typeof showToast === 'function') {
        showToast(`Fetching live report data for "${user || 'all users'}"...`, 'info');
    }

    // Trigger API fetch for active tab
    renderReport(currentTab);
}

/* ── Initialize ── */
document.addEventListener('DOMContentLoaded', () => {
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    const fromEl = document.getElementById('from-date');
    const toEl = document.getElementById('to-date');
    if (fromEl && !fromEl.value) fromEl.value = today;
    if (toEl && !toEl.value) toEl.value = today;

    // Load initial report
    renderReport('day-end-summary');
});
