/**
 * Admin Security Page & Sub-Views Logic
 * Radio sub-nav, User List rendering, Add User & Edit User forms
 */

// Sample User List data matching Image 3 screenshot
let USER_LIST = [
    { srNo: 1, id: '92', name: 'Aakash Kol', address: 'MAHUL', phone: '8655960574', imei: '', appType: 'Sales', dept: 'PRODUCTION', dsgn: 'COORDINATOR', empCode: 'S0357' },
    { srNo: 2, id: '77', name: 'Aditya Dubey', address: 'Andheri', phone: '9619875804', imei: '', appType: 'Marketing', dept: 'SALES', dsgn: 'EXECUTIVE', empCode: 'S0451' },
    { srNo: 3, id: '19', name: 'Amit Sandal', address: 'Andheri (E)', phone: '9619875001', imei: '', appType: 'grouphead', dept: 'MANAGEMENT', dsgn: 'ASSOCIATE VICE PRESIDENT', empCode: 'S0416' },
    { srNo: 4, id: '110', name: 'Anil Bhiku Chavhan', address: 'TURBHE', phone: '8463916703', imei: '', appType: 'Sales', dept: 'SALES', dsgn: 'EXECUTIVE', empCode: 'S0481' },
    { srNo: 5, id: '86', name: 'Anil Bind', address: 'MAHUL', phone: '8097454265', imei: '', appType: 'Sales', dept: 'HSE', dsgn: 'SR. MANAGER', empCode: 'SC0003' },
    { srNo: 6, id: '13', name: 'Avinash Jadhav', address: 'Andheri (E)', phone: '9619875083', imei: '', appType: 'Sales', dept: '0', dsgn: '0', empCode: '0' },
    { srNo: 7, id: '87', name: 'Bunty Sarkar', address: 'MAHUL', phone: '9136956784', imei: '', appType: 'Sales', dept: 'PURCHASE', dsgn: 'EXECUTIVE', empCode: 'S0116' },
    { srNo: 8, id: '118', name: 'Chandrashekhar Yadav', address: 'MAHUL', phone: '8097454281', imei: '', appType: 'Sales', dept: 'MARKETING', dsgn: 'MANAGER', empCode: 'S0346' },
    { srNo: 9, id: '12', name: 'Chetan Desai', address: 'Andheri', phone: '9619875021', imei: '', appType: 'Marketing', dept: 'TESTING', dsgn: 'TEST', empCode: 'S0023' },
    { srNo: 10, id: '17', name: 'Devendra', address: 'Andheri', phone: '9619875024', imei: '', appType: 'Marketing', dept: 'IT', dsgn: 'MANAGER', empCode: 'S0163' }
];

function handleVerifyAdminPassword(e) {
    if (e) e.preventDefault();
    const passInput = document.getElementById('sec-password');
    const modal = document.getElementById('admin-pass-modal');
    const unlockedView = document.getElementById('admin-unlocked-view');

    if (!passInput) return;

    if (passInput.value === 'admin') {
        if (modal) modal.classList.remove('open');
        if (unlockedView) unlockedView.style.display = 'block';
        showToast('Admin Configuration Unlocked', 'success');
        renderUserListTable();
    } else {
        showToast('Incorrect security password!', 'error');
        passInput.value = '';
        passInput.focus();
    }
}

function switchAdminSubView(viewKey) {
    // Hide all subview panels
    document.querySelectorAll('.subview-panel').forEach(p => p.classList.remove('active'));

    // Check radio button
    const radio = document.querySelector(`input[name="adminSubNav"][value="${viewKey}"]`);
    if (radio) radio.checked = true;

    if (viewKey === 'add-user') {
        const panel = document.getElementById('subview-add-user');
        if (panel) panel.classList.add('active');
    } else if (viewKey === 'user-mgmt') {
        const panel = document.getElementById('subview-user-mgmt');
        if (panel) panel.classList.add('active');
        renderUserListTable();
    } else if (viewKey === 'edit-user') {
        const panel = document.getElementById('subview-edit-user');
        if (panel) panel.classList.add('active');
    } else {
        // Placeholder for other subnav views
        const panel = document.getElementById('subview-placeholder');
        const title = document.getElementById('placeholder-title');
        if (title) title.textContent = viewKey.toUpperCase().replace('-', ' ');
        if (panel) panel.classList.add('active');
    }
}

function renderUserListTable() {
    const tbody = document.getElementById('user-list-tbody');
    if (!tbody) return;

    if (!USER_LIST || USER_LIST.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="empty-table-msg">No users registered in system</td></tr>`;
        return;
    }

    tbody.innerHTML = USER_LIST.map(u => `
        <tr>
            <td class="col-srno">${u.srNo}</td>
            <td><strong>${u.id}</strong></td>
            <td><strong>${u.name}</strong></td>
            <td>${u.address}</td>
            <td>${u.phone}</td>
            <td>${u.imei || '-'}</td>
            <td><span class="app-type-badge">${u.appType}</span></td>
            <td><span class="dept-badge-blue">${u.dept}</span></td>
            <td>${u.dsgn}</td>
            <td><code class="code-emp">${u.empCode}</code></td>
            <td><button class="link-edit-btn" onclick="openEditUserDetails('${u.id}')">Edit..</button></td>
        </tr>
    `).join('');
}

function handleAddUserSubmit(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('add-user-name').value.trim();
    const imei = document.getElementById('add-imei').value.trim();
    const phone = document.getElementById('add-phone').value.trim();
    const address = document.getElementById('add-address').value.trim();
    const appType = document.getElementById('add-app-type').value;
    const dept = document.getElementById('add-user-dept').value;
    const dsgn = document.getElementById('add-user-dsgn').value;
    const empCode = document.getElementById('add-emp-code').value.trim() || 'S0' + Math.floor(100 + Math.random() * 900);

    if (!name) {
        showToast('Please enter user name', 'error');
        return;
    }

    const newId = String(120 + USER_LIST.length + 1);
    const newSrNo = USER_LIST.length + 1;

    const newUser = {
        srNo: newSrNo,
        id: newId,
        name: name,
        address: address || 'N/A',
        phone: phone || 'N/A',
        imei: imei,
        appType: appType,
        dept: dept,
        dsgn: dsgn,
        empCode: empCode
    };

    USER_LIST.push(newUser);
    showToast(`User "${name}" added successfully!`, 'success');

    // Clear form
    document.getElementById('form-add-user').reset();

    // Switch to User Management view
    switchAdminSubView('user-mgmt');
}

function openEditUserDetails(userId) {
    const user = USER_LIST.find(u => String(u.id) === String(userId));
    if (!user) return;

    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-user-name').value = user.name;
    document.getElementById('edit-imei').value = user.imei || '';
    document.getElementById('edit-phone').value = user.phone;
    document.getElementById('edit-address').value = user.address;
    document.getElementById('edit-app-type').value = user.appType;
    document.getElementById('edit-dept').value = user.dept;
    document.getElementById('edit-dsgn').value = user.dsgn;
    document.getElementById('edit-emp-code').value = user.empCode;

    switchAdminSubView('edit-user');
}

function handleEditUserSubmit(e) {
    if (e) e.preventDefault();

    const id = document.getElementById('edit-user-id').value;
    const userIndex = USER_LIST.findIndex(u => String(u.id) === String(id));

    if (userIndex !== -1) {
        USER_LIST[userIndex].name = document.getElementById('edit-user-name').value.trim();
        USER_LIST[userIndex].imei = document.getElementById('edit-imei').value.trim();
        USER_LIST[userIndex].phone = document.getElementById('edit-phone').value.trim();
        USER_LIST[userIndex].address = document.getElementById('edit-address').value.trim();
        USER_LIST[userIndex].appType = document.getElementById('edit-app-type').value;
        USER_LIST[userIndex].dept = document.getElementById('edit-dept').value;
        USER_LIST[userIndex].dsgn = document.getElementById('edit-dsgn').value;
        USER_LIST[userIndex].empCode = document.getElementById('edit-emp-code').value.trim();

        showToast(`User details for "${USER_LIST[userIndex].name}" updated!`, 'success');
        switchAdminSubView('user-mgmt');
    }
}

function handleDeleteUser() {
    const id = document.getElementById('edit-user-id').value;
    const userIndex = USER_LIST.findIndex(u => String(u.id) === String(id));

    if (userIndex !== -1) {
        const userName = USER_LIST[userIndex].name;
        USER_LIST.splice(userIndex, 1);
        showToast(`User "${userName}" deleted from system`, 'info');
        switchAdminSubView('user-mgmt');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Focus security password input when modal opens
    const passInput = document.getElementById('sec-password');
    if (passInput) setTimeout(() => passInput.focus(), 300);
});
