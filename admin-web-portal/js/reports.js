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
    'checkin-status': ['SR NO', 'EMPNAME', 'CHECKIN', 'IN LOCATION', 'IN LATLONG', 'CHECKOUT', 'OUT LOCATION', 'OUT LATLONG', 'DURATION'],
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

function formatDateForApi(dateStr) {
    if (!dateStr) {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        return `${y}/${m}/${d}`;
    }
    return dateStr.replaceAll('-', '/');
}

/* ── Render Report Function ── */
async function renderReport(tabId) {
    currentTab = tabId || currentTab;
    const columns = REPORT_COLUMNS[currentTab] || [];
    const title = REPORT_TITLES[currentTab] || 'REPORT';

    // Update report header title
    const titleEl = document.getElementById('report-title');
    if (titleEl) titleEl.textContent = title;

    // Get filter inputs
    const user = (document.getElementById('search-user') ? document.getElementById('search-user').value : 'demo group') || 'demo group';
    const client = (document.getElementById('search-client') ? document.getElementById('search-client').value.trim() : '') || 'All';
    const fromDate = document.getElementById('from-date') ? document.getElementById('from-date').value : '';
    const toDate = document.getElementById('to-date') ? document.getElementById('to-date').value : '';
    const fromTime = document.getElementById('from-time') ? document.getElementById('from-time').value : '00:00';
    const toTime = document.getElementById('to-time') ? document.getElementById('to-time').value : '23:59';

    // Update header meta info
    const rangeEl = document.getElementById('report-range');
    const dateEl = document.getElementById('report-date');
    if (rangeEl && fromDate && toDate) {
        rangeEl.textContent = `${fromDate} ${fromTime} - ${toDate} ${toTime}`;
    }
    if (dateEl) {
        const now = new Date();
        dateEl.textContent = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    // Render table header
    const thead = document.querySelector('#report-table thead tr');
    if (thead) {
        thead.innerHTML = columns.map(col => `<th>${col}</th>`).join('');
    }

    // Show Loading state
    const tbody = document.getElementById('report-tbody');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="${columns.length}" style="text-align: center; padding: 24px; color: var(--text-sub);">Loading live report data from server...</td></tr>`;
    }

    try {
        let rows = [];

        if (currentTab === 'day-end-summary' || currentTab === 'checkin-status') {
            rows = await fetchDayEndSummary(fromDate, toDate, user, client, currentTab);
        } else if (currentTab === 'dsr-client' || currentTab === 'booking-report') {
            rows = await fetchDsrLeadReport(fromDate, toDate, user, client, currentTab);
        } else if (currentTab === 'dsr-summary') {
            rows = await fetchDsrSummaryReport(fromDate, toDate, user, client);
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

/**
 * Master Indian Standard Time (IST GMT+5:30) Converter
 * Converts any date string ("2026-08-20T23:07:00.000Z"), date-time ("21/08/2026 04:37"),
 * or time string ("04:54:54" / "04:37") to Indian Standard Time (GMT+5:30).
 */
function formatToIndianTime(val) {
    if (!val || val === '--' || typeof val !== 'string' || !val.trim()) return val || '--';

    const trimmed = val.trim();

    // Pure Time String like "04:37:00" or "04:54" or "05:08:18"
    if (trimmed.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
        const parts = trimmed.split(':');
        let h = parseInt(parts[0], 10);
        let m = parseInt(parts[1], 10);
        let s = parts.length > 2 ? parseInt(parts[2], 10) : null;

        if (!isNaN(h) && !isNaN(m)) {
            m += 30;
            if (m >= 60) {
                m -= 60;
                h += 1;
            }
            h += 5;
            if (h >= 24) {
                h -= 24;
            }
            const hh = String(h).padStart(2, '0');
            const mm = String(m).padStart(2, '0');
            if (s !== null && !isNaN(s)) {
                const ss = String(s).padStart(2, '0');
                return `${hh}:${mm}:${ss}`;
            }
            return `${hh}:${mm}`;
        }
    }

    // Date-Time string like "21/08/2026 04:37" or "2026-08-21 04:37"
    if (trimmed.includes(' ') && !trimmed.includes('T')) {
        const parts = trimmed.split(' ');
        const convertedTime = formatToIndianTime(parts[1]);
        return `${parts[0]} ${convertedTime}`;
    }

    // ISO Timestamp like "2026-08-20T23:07:00.000Z"
    let dt = null;
    if (trimmed.includes('T') || trimmed.endsWith('Z')) {
        dt = new Date(trimmed);
    } else if (trimmed.match(/^\d{4}[\/-]\d{2}[\/-]\d{2}/)) {
        const formattedIso = trimmed.replaceAll('/', '-').replace(' ', 'T') + 'Z';
        dt = new Date(formattedIso);
    }

    if (dt && !isNaN(dt.getTime())) {
        const options = {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const formatted = new Intl.DateTimeFormat('en-GB', options).format(dt);
        const parts = formatted.replace(',', '').split(' ');
        const convertedTime = formatToIndianTime(parts[1]);
        return `${parts[0]} ${convertedTime}`;
    }

    return trimmed;
}

function formatCellDateIST(dateVal) {
    return formatToIndianTime(dateVal);
}

function convertTimeStringToIST(timeStr) {
    return formatToIndianTime(timeStr);
}

function getTimeOnlyIST(dateVal) {
    if (!dateVal || dateVal === '--') return '';
    const formattedStr = formatToIndianTime(dateVal);
    if (formattedStr.includes(' ')) {
        const parts = formattedStr.split(' ');
        return parts[1];
    }
    return formattedStr;
}

/* ── API 1: Fetch Day End Summary 2 & Check In/Out Status ── */
async function fetchDayEndSummary(fromDate, toDate, user, client, tabId) {
    const sDateFormatted = formatDateForApi(fromDate);
    const eDateFormatted = formatDateForApi(toDate);
    const usernameis = (user === 'All Users' || !user) ? 'All' : user;
    const sessionUser = (user === 'All Users' || !user) ? 'demo group' : user;

    if (tabId === 'checkin-status') {
        const payload = {
            startdatep: `${sDateFormatted} 00:00`,
            enddatep: `${eDateFormatted} 23:59`,
            userv: usernameis,
            clientv: client || 'All',
            gempname: sessionUser
        };
        const res = await fetch(`${API_BASE_URL}/getinoutdetails_v1`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

        return records.map((row, i) => {
            let durationStr = '--';
            if (row.checkin && row.checkout) {
                const dIn = new Date(row.checkin);
                const dOut = new Date(row.checkout);
                const diffMs = dOut - dIn;
                if (diffMs >= 0) {
                    const totalMins = Math.floor(diffMs / 60000);
                    const hrs = Math.floor(totalMins / 60);
                    const mins = totalMins % 60;
                    durationStr = `hrs:${hrs} mins:${mins}`;
                }
            }

            return [
                String(row.srno || i + 1),
                row.username || row.empname || user,
                formatCellDateIST(row.checkin || '--'),
                row.addressin || row.glocation || '--',
                row.latin || `${row.glatitude || '18.4748056'},${row.glongitude || '73.8119057'}`,
                formatCellDateIST(row.checkout || '--'),
                row.addressout || row.glocation || '--',
                row.latout || `${row.glatitude || '18.4748056'},${row.glongitude || '73.8119057'}`,
                durationStr
            ];
        });
    }

    // DAY END SUMMARY 2 (getiamatsummaryrtp_2)
    const payload = {
        startdate: sDateFormatted,
        enddate: `${sDateFormatted} 23:59`,
        gempname: sessionUser,
        username: usernameis
    };

    console.log('[Reports] Fetching getiamatsummaryrtp_2:', payload);
    const res = await fetch(`${API_BASE_URL}/getiamatsummaryrtp_2`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('[Reports] getiamatsummaryrtp_2 response:', data);
    const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

    return records.map((row, i) => {
        const status = row.activity || 'CHECKIN';
        const rawDate = row.datetimeis || row.dated || '--';
        const dateStr = formatCellDateIST(rawDate);
        const timeOnly = getTimeOnlyIST(rawDate);

        const startdayIST = convertTimeStringToIST(row.startday || (status === 'START' ? timeOnly : ''));
        const checkintimeIST = convertTimeStringToIST(row.checkintime || (status === 'CHECKIN' ? timeOnly : ''));
        const dsrtimeIST = convertTimeStringToIST(row.dsrtime || (status === 'DSR_UPDATE' || status === 'NEW_CLIENT' || status === 'OTHERS' ? timeOnly : ''));
        const checkouttimeIST = convertTimeStringToIST(row.checkouttime || (status === 'CHECKOUT' ? timeOnly : ''));
        const enddayIST = convertTimeStringToIST(row.endday || (status === 'END' ? timeOnly : ''));

        return [
            String(row.srno || i + 1),
            row.empname || user,
            dateStr,
            startdayIST,
            checkintimeIST,
            dsrtimeIST,
            checkouttimeIST,
            enddayIST,
            row.duration || '',
            status,
            row.clientname || row.client || '',
            row.gpsaddress || '--',
            (row.glatitude && row.glongitude) ? `${row.glatitude}, ${row.glongitude}` : (row.latlong || '--')
        ];
    });
}

/* ── API 2: Fetch DSR Lead & Client Report ── */
async function fetchDsrLeadReport(fromDate, toDate, user, client, tabId) {
    const sDateFormatted = formatDateForApi(fromDate);
    const eDateFormatted = formatDateForApi(toDate);
    const groupUser = (user === 'All Users' || !user) ? 'demo group' : user;

    const payload = {
        startdatep: `${sDateFormatted} 00:00`,
        enddatep: `${eDateFormatted} 23:59`,
        userv: (user === 'All Users' || !user) ? 'All' : user,
        clientv: (client && client !== 'All') ? client : 'All',
        gempname: groupUser
    };

    console.log('[Reports] Fetching getdsrleadreport_v1:', payload);
    const res = await fetch(`${API_BASE_URL}/getdsrleadreport_v1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log('[Reports] getdsrleadreport_v1 response:', data);
    const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

    if (tabId === 'dsr-client') {
        return records.map((row, i) => [
            String(i + 1),
            row.assignedemp || row.assigned_emp || row.gempname || groupUser,
            formatCellDateIST(row.leaddatetime || row.created_timestamp || row.currentdatetime || '--'),
            row.customername || row.nleadname || row.leadname || row.outletname || row.client || '--',
            row.leadsitename || row.sitename || row.site_name || row.nleadname || '--',
            row.officeaddres || row.office_address || '--',
            row.contactperson || row.contact_person || '--',
            row.ncontact || row.contactno || row.contact_no || '--',
            row.n_nremark || row.remark || row.nremark || '--',
            formatCellDateIST(row.nfollowup || row.nextfollowup || '--')
        ]);
    }

    if (tabId === 'booking-report') {
        return records.map((row, i) => [
            String(i + 1),
            row.lleadno || row.bookingno || `BK-${i + 101}`,
            formatCellDateIST(row.leaddatetime || row.currentdatetime || '--'),
            row.customername || row.leadname || row.outletname || '--',
            row.leadsitename || row.sitename || '--',
            row.quantity || '1',
            row.rate || '--',
            row.totalamount || '--',
            row.status || 'Confirmed'
        ]);
    }

    return [];
}

/* ── API 3: Fetch DSR Summary Report ── */
async function fetchDsrSummaryReport(fromDate, toDate, user, client) {
    const sDate = fromDate || new Date().toISOString().split('T')[0];
    const tDate = toDate || sDate;
    
    // Increment sum_till by 1 day so SQL query `date < sum_till` includes the full end date
    const dTill = new Date(tDate);
    dTill.setDate(dTill.getDate() + 1);
    const sumTill = dTill.toISOString().split('T')[0];

    const groupUser = (user === 'All Users' || !user) ? 'demo group' : user;

    const payload = {
        gemptype: 'admin',
        gempname: groupUser,
        sum_from: sDate,
        sum_till: sumTill,
        dsruser: (client && client !== 'All') ? client : 'All'
    };

    console.log('[Reports] Fetching dailyreportformatsummary_v3:', payload);
    const res = await fetch(`${API_BASE_URL}/dailyreportformatsummary_v3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('[Reports] dailyreportformatsummary_v3 response:', data);
    const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

    return records.map((row, i) => [
        String(i + 1),
        row.vendorname || row.clientname || row.client || '--',
        row.sitename || row.site_name || '--',
        row.gonefor || row.visitedfor || row.visited_for || 'DSR Update',
        row.assignedto || row.assignedemp || groupUser,
        String(row.noofvisite || row.visitcount || 1)
    ]);
}

/* ── API 4: Fetch Start/End Day Attendance Report ── */
async function fetchStartEndReport(fromDate, toDate, user) {
    const sDateFormatted = formatDateForApi(fromDate);
    const eDateFormatted = formatDateForApi(toDate);
    const groupUser = (user === 'All Users' || !user) ? 'demo group' : user;

    const payload = {
        startdate: `${sDateFormatted} 00:00`,
        enddate: `${eDateFormatted} 23:59`,
        gempname: groupUser,
        username: (user === 'All Users' || !user) ? 'All' : user
    };

    const res = await fetch(`${API_BASE_URL}/getcheckinoutrtp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

    return records.map((row, i) => [
        String(row.srno || i + 1),
        row.empname || groupUser,
        formatCellDateIST(row.startendtime || row.starttime || '--'),
        formatCellDateIST(row.receivedon || '--'),
        row.statusis || row.activity || 'START',
        row.gaddress || row.gpsaddress || '--',
        formatCellDateIST(row.end_startendtime || row.checkouttime || '--'),
        formatCellDateIST(row.end_receivedon || '--'),
        'END',
        row.end_gaddress || row.gaddress || '--',
        row.duration || '--'
    ]);
}

/* ── API 5: Fetch Travel Path Location Data ── */
async function fetchTravelPathReport(fromDate, toDate, user) {
    const sDateFormatted = formatDateForApi(fromDate);
    const eDateFormatted = formatDateForApi(toDate);

    const payload = {
        username: user === 'All Users' ? 'All' : user,
        startdatetime: `${sDateFormatted} 00:00`,
        enddatetime: `${eDateFormatted} 23:59`
    };

    const res = await fetch(`${API_BASE_URL}/getusertracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

    return records.map((row, i) => [
        String(i + 1),
        row.username || row.empname || user,
        `${row.glatitude || row.latitude || '18.4748056'}, ${row.glongitude || row.longitude || '73.8119057'}`,
        row.glocation || row.address || '--',
        formatCellDateIST(row.gpsdatetime || row.trackdate || row.datetimeis || '--'),
        String(row.gspeed || row.speed || '0'),
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
    // Set default dates to today
    const today = new Date().toISOString().split('T')[0];
    const fromEl = document.getElementById('from-date');
    const toEl = document.getElementById('to-date');
    if (fromEl) fromEl.value = today;
    if (toEl) toEl.value = today;

    // Load initial report
    renderReport('day-end-summary');
});
