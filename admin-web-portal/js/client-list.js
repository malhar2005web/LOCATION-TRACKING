/**
 * Client List Logic
 * Search, Add Client Modal, Form Handler
 */

let CLIENTS_DATA = [
    {
        srNo: '1',
        clientName: 'SKYWAY HEAD OFFICE (HO)',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: 'B-4, 09TH FLOOR, HDIL KALEDONIA, SAHAR ROAD, ANDHERI (EAST), MUMBAI - 400 069',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: '',
        panNo: ''
    },
    {
        srNo: '2',
        clientName: 'MPCB',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: '',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: 'Bg submition',
        panNo: ''
    },
    {
        srNo: '3',
        clientName: 'MCOM',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: '',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: '',
        panNo: ''
    },
    {
        srNo: '4',
        clientName: 'VASAI BUNGLOW (SKY NEST)',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: 'VASAI BUNGLOW',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: '',
        panNo: ''
    },
    {
        srNo: '5',
        clientName: 'PARTHENON',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: 'JP RD, OPPOSITE GURUDWARA, SAHAYOG NAGAR, FOUR BUNGALOWS, ANDHERI WEST',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: '',
        panNo: ''
    },
    {
        srNo: '63',
        clientName: 'C.S.T. COURT',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: '',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: '',
        panNo: ''
    },
    {
        srNo: '6',
        clientName: 'ANJUR RMC PLANT',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: '',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: '',
        panNo: ''
    },
    {
        srNo: '7',
        clientName: 'BANDRA RMC PLANT',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: '',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: 'Challan',
        panNo: ''
    },
    {
        srNo: '8',
        clientName: 'BORIVALI RMC PLANT',
        site: '',
        contactPerson: '',
        contactNo: '',
        mailId: '',
        address: '',
        registered: '2026/02/28 14:42',
        assignedUser: 'All',
        nextFollowup: '2026/02/23 00:00',
        remark: 'Sales challan and reports collected',
        panNo: ''
    }
];

function renderClientTable(data) {
    const tbody = document.getElementById('client-tbody');
    if (!tbody) return;

    if (!data || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" class="empty-table-msg">No client records found matching search query</td></tr>`;
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
    const query = document.getElementById('search-client-input').value.trim().toLowerCase();
    if (!query) {
        renderClientTable(CLIENTS_DATA);
        showToast('Showing all client records', 'success');
        return;
    }

    const filtered = CLIENTS_DATA.filter(item => 
        item.clientName.toLowerCase().includes(query) || 
        item.address.toLowerCase().includes(query) ||
        item.remark.toLowerCase().includes(query)
    );
    renderClientTable(filtered);
    showToast(`Found ${filtered.length} client(s) matching "${query}"`, 'success');
}

/* ── Modal Controls ── */
function openAddClientModal() {
    const modal = document.getElementById('add-client-modal');
    if (modal) {
        modal.classList.add('open');
        // Set today's date in followup date input
        const dateInput = document.getElementById('client-followup-date');
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    }
}

function closeAddClientModal() {
    const modal = document.getElementById('add-client-modal');
    if (modal) modal.classList.remove('open');
}

function handleCreateClient(e) {
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
    const regTime = `${now.getFullYear()}/${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const nextFollowup = date ? `${date.replace(/-/g,'/')} ${hrs}:${min}` : '';

    const newClient = {
        srNo: String(CLIENTS_DATA.length + 1),
        clientName: name.toUpperCase(),
        site: site,
        contactPerson: contactPerson,
        contactNo: mobile,
        mailId: email,
        address: address,
        registered: regTime,
        assignedUser: 'admin',
        nextFollowup: nextFollowup,
        remark: remark,
        panNo: pan,
        gstNo: gst
    };

    CLIENTS_DATA.unshift(newClient);
    renderClientTable(CLIENTS_DATA);
    closeAddClientModal();

    // Reset form
    document.getElementById('new-client-form').reset();
    showToast(`New client "${name}" created successfully!`, 'success');
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
    renderClientTable(CLIENTS_DATA);
});
