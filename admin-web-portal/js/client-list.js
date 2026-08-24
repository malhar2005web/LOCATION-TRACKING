/**
 * Client List Logic
 * Dynamically fetches live client directory from API (getclientlistbygroup)
 */

const API_BASE_URL = 'https://fleettrackon.co.in/pcsdia';
let CLIENTS_DATA = [];

/**
 * Format date string for display in client list
 */
function formatClientDate(dateVal) {
    if (!dateVal || dateVal === '--') return '-';
    if (typeof dateVal === 'string') {
        if (dateVal.includes('T')) {
            const parts = dateVal.split('T');
            const d = parts[0].replace(/-/g, '/');
            const t = parts[1].slice(0, 5);
            return `${d} ${t}`;
        }
    }
    return String(dateVal);
}

/**
 * Fetch live client list from API
 */
async function fetchClientListFromApi(searchQuery = '') {
    const tbody = document.getElementById('client-tbody');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; padding: 36px; color: var(--text-sub);">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <svg style="animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                <span>Loading live client directory from server...</span>
            </div>
        </td></tr>`;
    }

    try {
        const payload = {
            userid: 'Paresh',
            gemptype: 'grouphead',
            leadnametosearch: searchQuery || '',
            groupnametosearch: '',
            gempcluster: ''
        };

        console.log('[ClientList] Fetching getclientlistbygroup:', payload);
        const res = await fetch(`${API_BASE_URL}/getclientlistbygroup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        console.log('[ClientList] API response count:', data && data.trackerid ? data.trackerid.length : 0);

        const records = (data && data.trackerid) ? data.trackerid : (Array.isArray(data) ? data : []);

        CLIENTS_DATA = records.map((row, i) => ({
            srNo: String(row.leadno || i + 1),
            clientName: row.leadname || '--',
            site: row.leadsitename || '',
            contactPerson: row.contactperson || '',
            contactNo: row.contactno || '',
            mailId: row.mailid || '',
            address: row.address || '',
            registered: formatClientDate(row.leaddatetime || row.currentdate || ''),
            assignedUser: row.assignedto || 'All',
            nextFollowup: formatClientDate(row.nextfollowup || ''),
            remark: row.remark || row.leadstatus || '',
            panNo: row.pannumber || '',
            gstNo: row.gstnumber || ''
        }));

        renderClientTable(CLIENTS_DATA);
    } catch (err) {
        console.error('[ClientList] Failed to fetch live clients:', err);
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; padding: 24px; color: #ef4444;">Failed to load live client list: ${err.message || 'Server error'}</td></tr>`;
        }
    }
}

function renderClientTable(data) {
    const tbody = document.getElementById('client-tbody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="13" class="empty-table-msg">No client records found matching search query</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map(item => `
        <tr>
            <td class="col-srno">${item.srNo}</td>
            <td class="col-client-name">
                <div class="client-cell">
                    <svg class="client-building-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
                    <a href="#" class="client-link">${item.clientName}</a>
                </div>
            </td>
            <td>${item.site ? `<span class="tag-site">${item.site}</span>` : '<span class="dash-null">-</span>'}</td>
            <td>${item.contactPerson ? `<strong>${item.contactPerson}</strong>` : '<span class="dash-null">-</span>'}</td>
            <td>${item.contactNo ? `<span class="phone-num">${item.contactNo}</span>` : '<span class="dash-null">-</span>'}</td>
            <td>${item.mailId ? `<span class="mail-text">${item.mailId}</span>` : '<span class="dash-null">-</span>'}</td>
            <td class="col-address">
                ${item.address ? `<div class="address-cell"><svg class="addr-pin" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg><span>${item.address}</span></div>` : '<span class="dash-null">-</span>'}
            </td>
            <td class="col-datetime">${item.registered ? `<span class="dt-text">${item.registered}</span>` : '<span class="dash-null">-</span>'}</td>
            <td><span class="user-pill-badge">${item.assignedUser || 'All'}</span></td>
            <td class="col-datetime">${item.nextFollowup ? `<div class="followup-cell"><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span>${item.nextFollowup}</span></div>` : '<span class="dash-null">-</span>'}</td>
            <td>${item.remark ? `<span class="remark-pill">${item.remark}</span>` : '<span class="dash-null">-</span>'}</td>
            <td>${item.panNo ? `<code class="code-pan">${item.panNo}</code>` : '<span class="dash-null">-</span>'}</td>
            <td>${item.gstNo ? `<code class="code-pan">${item.gstNo}</code>` : '<span class="dash-null">-</span>'}</td>
        </tr>
    `).join('');
}

function filterClients() {
    const query = document.getElementById('search-client-input').value.trim();
    if (!query) {
        renderClientTable(CLIENTS_DATA);
        showToast(`Showing all ${CLIENTS_DATA.length} client records`, 'success');
        return;
    }

    const lowerQ = query.toLowerCase();
    const filtered = CLIENTS_DATA.filter(item => 
        item.clientName.toLowerCase().includes(lowerQ) || 
        item.address.toLowerCase().includes(lowerQ) ||
        item.remark.toLowerCase().includes(lowerQ) ||
        item.contactPerson.toLowerCase().includes(lowerQ) ||
        item.contactNo.includes(query)
    );
    renderClientTable(filtered);
    showToast(`Found ${filtered.length} client(s) matching "${query}"`, 'success');
}

/* ── Modal Controls ── */
function openAddClientModal() {
    const modal = document.getElementById('add-client-modal');
    if (modal) {
        modal.classList.add('open');
        const dateInput = document.getElementById('client-followup-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function closeAddClientModal() {
    const modal = document.getElementById('add-client-modal');
    if (modal) modal.classList.remove('open');
}

async function handleCreateClient(e) {
    e.preventDefault();

    const name = document.getElementById('client-name').value.trim();
    const pan = document.getElementById('client-pan').value.trim();
    const gst = document.getElementById('client-gst').value.trim();
    const mobile = document.getElementById('client-mobile').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const contactPerson = document.getElementById('client-contact-person').value.trim();
    const address = document.getElementById('client-office-address').value.trim();
    const site = document.getElementById('client-site-details').value.trim();
    const remark = document.getElementById('client-remark').value.trim();
    const date = document.getElementById('client-followup-date').value;
    const hrs = document.getElementById('followup-hrs').value;
    const min = document.getElementById('followup-min').value;

    const now = new Date();
    const currentdatetime = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const payload = {
        userid: '6',
        gemptype: 'grouphead',
        assignedemp: 'demo group',
        CustomerName: name,
        CustomerType: 'Client',
        PANNumber: pan,
        GSTNumber: gst,
        officeaddress: address,
        MobileNumber: mobile,
        landlinenumber: '',
        EmailAddress: email,
        FullName1: contactPerson,
        outletname: name,
        nleadname: name,
        ncontact: mobile,
        nlanddine: '',
        BankAccount: '',
        BankName: '',
        BankAddress: '',
        ifsccode: '',
        onereference1: '',
        onereference2: '',
        currentdatetime: currentdatetime,
        intime_h: '10',
        intime_m: '00',
        outtime_h: '11',
        outtime_m: '00',
        ocos: 'Open',
        ncns: 'New Lead',
        nremark: remark,
        nfollowup: date || '',
        nfollowuptime_h: hrs,
        nfollowuptime_m: min,
        c_assignedto: 'demo group',
        gpsLatitude: '18.4748056',
        gpsLongitude: '73.8119057'
    };

    try {
        console.log('[ClientList] Creating new client via API:', payload);
        const res = await fetch(`${API_BASE_URL}/generatenewlead`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const resData = await res.json();
        console.log('[ClientList] generatenewlead response:', resData);

        showToast(`New client "${name}" created successfully on server!`, 'success');
        closeAddClientModal();
        document.getElementById('new-client-form').reset();

        // Refresh client list from API
        fetchClientListFromApi();
    } catch (err) {
        console.error('[ClientList] Failed to create client:', err);
        showToast(`Error creating client: ${err.message}`, 'error');
    }
}

// Close modal when clicking outside form container
document.addEventListener('click', (e) => {
    const modal = document.getElementById('add-client-modal');
    const modalCard = document.querySelector('.modal-card');
    if (modal && modal.classList.contains('open') && !modalCard.contains(e.target) && !e.target.closest('.btn-add-client')) {
        closeAddClientModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchClientListFromApi();
});
