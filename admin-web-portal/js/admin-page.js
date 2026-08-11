/**
 * Admin Security Page & Complete Sub-Views Logic
 * Radio sub-nav, User List, Assign Client, Group Head, Leave Management & Leave List
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

// Sample Assign Client dataset matching Image 1 screenshot
let ASSIGN_CLIENTS_DATA = [
    {
        srNo: 1,
        customerName: 'SKYWAY HEAD OFFICE (HO)',
        salesPersons: 'Avinash Jadhav, Hemant Patil, Mandodhar Navale, Parshuram Pawar, Pramod Soni, Ankush Jamdar, Mahesh Salvi, Mahesh Gurav, Rahul Mishra, Manisha Namugade, Dinesh Shelar, Aashish Chavan, Santosh Sawant, Jayesh Panchal, Satish More, Jayant Chonkar, Lautan Yadav, Anil Barpode, Jaiprakash v. yadav, Dhruv R Shakhsat, Saurabh Kumar Maurya, Uttam Bhandri, Yaswant Yadav, Sachin Nishad, Satyendra Sharma, Aniket Bind, Vinay Sharma, Rajeah Ramsingh Saraki, Pravin Mallah, Avadhut Ayare, Kishor Sawant, Rajendra Motgunde, Sandesh Gujar, Shankar S Ghadi, DIPAK RAMCHANDRA GOMANE, SATYANARYAN SINGH, Shirish Gaikwad, Vikas Kadam, Jayesh Kokare, Rahul Ahire, Swapnil Kandale, Vikrant Dhavade, Hitesh shivgan, Ravindra Jogdand, Prem Prakash, Ramesh Nishad, Chandrakant Ghadigaonkar, Milind Subhash Aait, Bikash Chowdhury, Shivram Jadhav, Mohammad Shadab, Nagesh Nanaje, Rishikesh Kadam, Anil Bind, Bunty Sarkar, Nityanand Changote, Sunil Panda, Md. Shabbir Ashraf, Nitin Mishra, Rajesh Etawa Lugun, Aakash Kol, Arafat Mandal, Gopal Helode, Govind Ingle, Hitesh Patel, Iqbal Mumtaz Kam, Jivan Turkey, Mahesh Helava, Michel Dang, Nagesh Tapge, Niranjan Kumar, Pankaj Singh, Rintu Shaikh, Surendra Yadav, Suryakant Kumbhar, Vaibhav Tiwari, Vijay Tiwari, Adrash',
        marketingPersons: 'Chetan Desai, Devendra Dubey, Rakesh Mishra, Sunil Patil, Gulab Pathan, Umesh Jadhav, Prakash Kokane, Sanket Tambe, ganesh test, Abhishek Pareenja, Prathamesh Dhavade, Sandeep Chikane, Aditya Dubey',
        headPersons: 'Paresh Raval, Ram Kadam, Raju Rathod, Dyaneshwar Nagare, Gulab Pathan, Maninder Kaur, Harendra Bagwa, Baliram Badad, Rupesh Sancheti, Sebastian Chettiar, Kunal Koul, Vishal Mishra, Amit Sandal, Uttam Bhandri, Sahdab Subhani'
    }
];

// Sample Group Head dataset matching Image 3 screenshot
let GROUP_HEAD_DATA = [
    {
        srNo: 1,
        groupHead: 'Amit Sandal',
        userList: 'Baliram Badad, Chetan Desai, Devendra Dubey, Kunal Koul, Rakesh Mishra, Sebastian Chettiar, Sunil Patil, Dyaneshwar Nagare, Jayant Chonkar, Lautan Yadav, Prakash Kokane, Sanket Tambe, Uttam Bhandri, Rajendra Motgunde, Abhishek Pareenja, Swapnil Kandale, Sandeep Chikane, Aditya Dubey, Milind Subhash Aait, Bikash Chowdhury, Shivram Jadhav, Paresh, demo admin2, demo group'
    },
    {
        srNo: 2,
        groupHead: 'Baliram Badad',
        userList: 'Sebastian Chettiar, Kunal Koul, Rakesh Mishra, Chetan Desai, Devendra Dubey, Avinash Jadhav, Hemant Patil, Mandodhar Navale, Parshuram Pawar, Pramod Soni, Paresh Raval, Ankush Jamdar, Mahesh Salvi, Mahesh Gurav, Sunil Patil, Dyaneshwar Nagare, Rahul Mishra, Dinesh Shelar, Aashish Chavan, Amit Sandal, Baliram Badad, Jayesh Panchal, Raju Rathod, Ram Kadam, Santosh Sawant, Jayant Chonkar, Lautan Yadav, Chandrakant Ghadigaonkar, Gulab Pathan, Prakash Kokane, Jaiprakash v. yadav, Dhruv R Shakhsat, Sanket Tambe, Saurabh Kumar Maurya, Uttam Bhandri, Yaswant Yadav, Sachin Nishad, Satyendra Sharma, Aniket Bind, Vinay Sharma, Pravin Mallah, Ramesh Nishad, Prem Prakash, Avadhut Ayare, Kishor Sawant, Rajendra Motgunde, Sandesh Gujar, Shankar S Ghadi, Abhishek Pareenja, DIPAK RAMCHANDRA GOMANE, SATYANARYAN SINGH, Shirish Gaikwad, Vikas Kadam, Jayesh Kokare, Rahul Ahire, Swapnil Kandale, Vikrant'
    }
];

// Sample Leave Group dataset matching Image 2 screenshot
let LEAVE_GROUP_DATA = [
    {
        srNo: 1,
        checked: true,
        groupHead: 'Amit Sandal',
        userList: 'Baliram Badad,Sebastian Chettiar,Kunal Koul,Rakesh Mishra,Sunil Patil,Dyaneshwar Nagare,Prakash Kokane,Sanket Tambe,Uttam Bhandri,Abhishek Pareenja,Swapnil Kandale,Sandeep Chikane,Aditya Dubey,Milind Subhash Aait,Bikash Chowdhury,Shivaram Jadhav,Paresh,demo admin2,demo group'
    },
    {
        srNo: 2,
        checked: false,
        groupHead: 'Baliram Badad',
        userList: 'Vishal Mishra,Paresh Raval,Sunil Patil,Dyaneshwar Nagare,Rahul Mishra,Sanket Tambe,Uttam Bhandri,Prakash Kokane,DIPAK RAMCHANDRA GOMANE,Swapnil Kandale,Sandeep Chikane,Milind Subhash Aait,Bikash Chowdhury,Shivaram Jadhav,Sahdab Subhani,Paresh,demo admin2,demo group'
    },
    {
        srNo: 3,
        checked: false,
        groupHead: 'Chetan Desai',
        userList: 'Devendra Dubey,Avinash Jadhav,Hemant Patil,Mandodhar Navale,Parshuram Pawar,Ankush Jamdar,Mahesh Salvi,Mahesh Gurav,Aashish Chavan,Chandrakant Ghadigaonkar,Anil Barpode,Dhruv R Shakhsat,Avadhut Ayare,Sandesh Gujar,Shankar S Ghadi,DIPAK RAMCHANDRA GOMANE,Shirish Gaikwad,Vikas Kadam,Jayesh Kokare,Rahul Ahire,Vikrant Dhawade,Hitesh shivgan,Ravindra Jogdand,Rushikesh Kadam,Paresh,demo admin2,demo group'
    },
    {
        srNo: 4,
        checked: false,
        groupHead: 'Kunal Koul',
        userList: 'Rakesh Mishra,Devendra Dubey,Sunil Patil,Prakash Kokane,Abhishek Pareenja,Saurabh Kumar Maurya,Sandeep Chikane,Aditya Dubey,Paresh,demo admin2,demo group'
    }
];

// Sample Leave Management dataset matching Image 4 screenshot
let LEAVE_MGMT_DATA = [
    { srNo: 1, empCode: 'EMP001', empName: 'demo group', empDept: 'Operations', el: 12, cl: 7, sl: 7, ol: 2, wp: 0, toShow: true },
    { srNo: 2, empCode: 'EMP042', empName: 'Aashish Chavan', empDept: 'Sales', el: 10, cl: 5, sl: 6, ol: 0, wp: 0, toShow: true },
    { srNo: 3, empCode: 'EMP015', empName: 'Paresh', empDept: 'IT', el: 14, cl: 8, sl: 8, ol: 1, wp: 0, toShow: true },
    { srNo: 4, empCode: 'S0357', empName: 'Aakash Kol', empDept: 'PRODUCTION', el: 15, cl: 6, sl: 6, ol: 0, wp: 0, toShow: true },
    { srNo: 5, empCode: 'S0451', empName: 'Aditya Dubey', empDept: 'SALES', el: 12, cl: 7, sl: 7, ol: 0, wp: 0, toShow: true }
];

// Sample Leave List (Festivals) dataset matching Image 5 screenshot
let FESTIVAL_LEAVES_DATA = [
    { srNo: 1, date: '2026/01/26', festival: 'Republic Day' },
    { srNo: 2, date: '2026/03/25', festival: 'Holi' },
    { srNo: 3, date: '2026/08/15', festival: 'Independence Day' },
    { srNo: 4, date: '2026/10/02', festival: 'Gandhi Jayanti' },
    { srNo: 5, date: '2026/11/01', festival: 'Diwali' },
    { srNo: 6, date: '2026/12/25', festival: 'Christmas' }
];

/* ── Password Verification ── */
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
        renderAssignClientsTable();
        renderGroupHeadTable();
        renderLeaveGroupTable();
        renderLeaveMgmtTable();
        renderLeaveListTable();
    } else {
        showToast('Incorrect security password!', 'error');
        passInput.value = '';
        passInput.focus();
    }
}

/* ── SubView Navigation Switcher ── */
function switchAdminSubView(viewKey) {
    document.querySelectorAll('.subview-panel').forEach(p => p.classList.remove('active'));

    const radio = document.querySelector(`input[name="adminSubNav"][value="${viewKey}"]`);
    if (radio) radio.checked = true;

    if (viewKey === 'add-user') {
        document.getElementById('subview-add-user')?.classList.add('active');
    } else if (viewKey === 'user-mgmt') {
        document.getElementById('subview-user-mgmt')?.classList.add('active');
        renderUserListTable();
    } else if (viewKey === 'edit-user') {
        document.getElementById('subview-edit-user')?.classList.add('active');
    } else if (viewKey === 'assign-client') {
        document.getElementById('subview-assign-client')?.classList.add('active');
        renderAssignClientsTable();
    } else if (viewKey === 'group-head') {
        document.getElementById('subview-group-head')?.classList.add('active');
        renderGroupHeadTable();
    } else if (viewKey === 'leave-group') {
        document.getElementById('subview-leave-group')?.classList.add('active');
        renderLeaveGroupTable();
    } else if (viewKey === 'leave-mgmt') {
        document.getElementById('subview-leave-mgmt')?.classList.add('active');
        renderLeaveMgmtTable();
    } else if (viewKey === 'leave-list') {
        document.getElementById('subview-leave-list')?.classList.add('active');
        renderLeaveListTable();
    }
}

let currentDeptFilter = 'ALL';
let currentSearchText = '';

/* ── Render User List (Image 3 + Modern Toolbar Filter) ── */
function renderUserListTable(customList = null) {
    const tbody = document.getElementById('user-list-tbody');
    if (!tbody) return;

    let listToRender = customList || USER_LIST;

    // Apply department chip filter
    if (currentDeptFilter !== 'ALL') {
        listToRender = listToRender.filter(u => u.dept.toUpperCase() === currentDeptFilter.toUpperCase());
    }

    // Apply search filter
    if (currentSearchText.trim() !== '') {
        const q = currentSearchText.toLowerCase();
        listToRender = listToRender.filter(u => 
            u.name.toLowerCase().includes(q) ||
            u.phone.toLowerCase().includes(q) ||
            u.dept.toLowerCase().includes(q) ||
            u.dsgn.toLowerCase().includes(q) ||
            u.empCode.toLowerCase().includes(q) ||
            u.address.toLowerCase().includes(q)
        );
    }

    if (!listToRender || listToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11" class="empty-table-msg">No matching users found</td></tr>`;
        return;
    }

    tbody.innerHTML = listToRender.map(u => `
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
            <td><button type="button" class="link-edit-btn" onclick="openEditUserDetails('${u.id}')">Edit..</button></td>
        </tr>
    `).join('');
}

function handleLiveSearchFilter() {
    const input = document.getElementById('admin-live-search');
    if (input) {
        currentSearchText = input.value;
        renderUserListTable();
    }
}

function clearLiveSearch() {
    const input = document.getElementById('admin-live-search');
    if (input) {
        input.value = '';
        currentSearchText = '';
        renderUserListTable();
    }
}

function filterByDeptChip(deptName, btnElem) {
    currentDeptFilter = deptName;
    document.querySelectorAll('.dept-chip').forEach(c => c.classList.remove('active'));
    if (btnElem) btnElem.classList.add('active');
    renderUserListTable();
}

function exportUserListToCSV() {
    let csv = 'SR NO,ID,USER NAME,ADDRESS,USER NUMBER,IMEI NUMBER,APP TYPE,DEPARTMENT,DESIGNATION,EMP CODE\n';
    USER_LIST.forEach(u => {
        csv += `"${u.srNo}","${u.id}","${u.name}","${u.address}","${u.phone}","${u.imei}","${u.appType}","${u.dept}","${u.dsgn}","${u.empCode}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `User_List_Export_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
    showToast('User List exported to CSV / Excel', 'success');
}

function exportUserListToPDF() {
    window.print();
}

/* ── Render Assign Client (Image 1) ── */
function renderAssignClientsTable() {
    const tbody = document.getElementById('assign-client-tbody');
    if (!tbody) return;

    tbody.innerHTML = ASSIGN_CLIENTS_DATA.map(c => `
        <tr>
            <td><input type="checkbox" class="chk-client-row"></td>
            <td class="col-srno">${c.srNo}</td>
            <td><strong>${c.customerName}</strong></td>
            <td><div class="scrollable-names-box">${c.salesPersons}</div></td>
            <td><div class="scrollable-names-box">${c.marketingPersons}</div></td>
            <td><div class="scrollable-names-box">${c.headPersons}</div></td>
            <td><button class="link-edit-btn" onclick="openUpdateClientModal('${c.customerName}')">UPDATE</button></td>
        </tr>
    `).join('');
}

/* ── Render Group Head (Image 3) ── */
function renderGroupHeadTable() {
    const tbody = document.getElementById('group-head-tbody');
    if (!tbody) return;

    tbody.innerHTML = GROUP_HEAD_DATA.map(gh => `
        <tr>
            <td><input type="checkbox" class="chk-gh-row"></td>
            <td class="col-srno">${gh.srNo}</td>
            <td><strong>${gh.groupHead}</strong></td>
            <td><div class="scrollable-names-box">${gh.userList}</div></td>
        </tr>
    `).join('');
}

/* ── Render Leave Group (Image 2) ── */
function renderLeaveGroupTable() {
    const tbody = document.getElementById('leave-group-tbody');
    if (!tbody) return;

    tbody.innerHTML = LEAVE_GROUP_DATA.map(lg => `
        <tr>
            <td><input type="checkbox" class="chk-lg-row" ${lg.checked ? 'checked' : ''}></td>
            <td class="col-srno">${lg.srNo}</td>
            <td><strong>${lg.groupHead}</strong></td>
            <td><div class="scrollable-names-box">${lg.userList}</div></td>
        </tr>
    `).join('');
}

function handleLeaveGroupAction(action) {
    showToast(`Leave Group ${action} operation completed!`, 'success');
}

function toggleSelectAllLeaveGroup(masterChk) {
    const checkboxes = document.querySelectorAll('.chk-lg-row');
    checkboxes.forEach(c => c.checked = masterChk.checked);
}

/* ── Render Leave Management (Image 4) ── */
function renderLeaveMgmtTable() {
    const tbody = document.getElementById('leave-mgmt-tbody');
    if (!tbody) return;

    tbody.innerHTML = LEAVE_MGMT_DATA.map(lm => `
        <tr>
            <td class="col-srno">${lm.srNo}</td>
            <td><code class="code-emp">${lm.empCode}</code></td>
            <td><strong>${lm.empName}</strong></td>
            <td><span class="dept-badge-blue">${lm.empDept}</span></td>
            <td><input type="number" class="table-num-inp" value="${lm.el}"></td>
            <td><input type="number" class="table-num-inp" value="${lm.cl}"></td>
            <td><input type="number" class="table-num-inp" value="${lm.sl}"></td>
            <td><input type="number" class="table-num-inp" value="${lm.ol}"></td>
            <td><input type="number" class="table-num-inp" value="${lm.wp}"></td>
            <td>
                <label class="toggle-switch">
                    <input type="checkbox" ${lm.toShow ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </td>
        </tr>
    `).join('');
}

/* ── Render Leave List (Image 5) ── */
function renderLeaveListTable() {
    const tbody = document.getElementById('leave-list-tbody');
    if (!tbody) return;

    tbody.innerHTML = FESTIVAL_LEAVES_DATA.map(f => `
        <tr>
            <td class="col-srno">${f.srNo}</td>
            <td>${f.date}</td>
            <td><strong>${f.festival}</strong></td>
        </tr>
    `).join('');
}

/* ── Update Client Details Modal Handlers (Image 2) ── */
function openUpdateClientModal(customerName) {
    const modal = document.getElementById('modal-update-client');
    if (modal) {
        modal.classList.add('open');
        if (customerName) {
            document.getElementById('uc-client-name').value = customerName;
        }
    }
}

function closeUpdateClientModal() {
    const modal = document.getElementById('modal-update-client');
    if (modal) modal.classList.remove('open');
}

function handleUpdateClientDetailsSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('uc-client-name').value;
    showToast(`Client details for "${name}" updated!`, 'success');
    closeUpdateClientModal();
}

/* ── Add User & Edit User Handlers ── */
function handleAddUserSubmit(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('add-user-name').value.trim();
    if (!name) return;

    const newId = String(120 + USER_LIST.length + 1);
    USER_LIST.push({
        srNo: USER_LIST.length + 1,
        id: newId,
        name: name,
        address: document.getElementById('add-address').value.trim() || 'N/A',
        phone: document.getElementById('add-phone').value.trim() || 'N/A',
        imei: document.getElementById('add-imei').value.trim(),
        appType: document.getElementById('add-app-type').value,
        dept: document.getElementById('add-user-dept').value,
        dsgn: document.getElementById('add-user-dsgn').value,
        empCode: document.getElementById('add-emp-code').value.trim() || 'S0399'
    });

    showToast(`User "${name}" added!`, 'success');
    document.getElementById('form-add-user').reset();
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

    // Open Slide-Over Drawer (Suggestion 3)
    const drawerOverlay = document.getElementById('drawer-edit-user-overlay');
    if (drawerOverlay) drawerOverlay.classList.add('open');
}

function closeEditUserDrawer() {
    const drawerOverlay = document.getElementById('drawer-edit-user-overlay');
    if (drawerOverlay) drawerOverlay.classList.remove('open');
}

function handleEditUserSubmit(e) {
    if (e) e.preventDefault();
    const id = document.getElementById('edit-user-id').value;
    const idx = USER_LIST.findIndex(u => String(u.id) === String(id));
    if (idx !== -1) {
        USER_LIST[idx].name = document.getElementById('edit-user-name').value.trim();
        USER_LIST[idx].phone = document.getElementById('edit-phone').value.trim();
        USER_LIST[idx].address = document.getElementById('edit-address').value.trim();
        USER_LIST[idx].appType = document.getElementById('edit-app-type').value;
        USER_LIST[idx].dept = document.getElementById('edit-dept').value;
        USER_LIST[idx].dsgn = document.getElementById('edit-dsgn').value;
        USER_LIST[idx].empCode = document.getElementById('edit-emp-code').value.trim();

        showToast(`User "${USER_LIST[idx].name}" updated!`, 'success');
        closeEditUserDrawer();
        renderUserListTable();
    }
}

function handleDeleteUser() {
    const id = document.getElementById('edit-user-id').value;
    const idx = USER_LIST.findIndex(u => String(u.id) === String(id));
    if (idx !== -1) {
        USER_LIST.splice(idx, 1);
        showToast('User deleted from system', 'info');
        closeEditUserDrawer();
        renderUserListTable();
    }
}

function handleAssignClientAction(action) {
    showToast(`Client ${action} operation completed!`, 'success');
}

function handleGroupHeadAction(action) {
    showToast(`Group Head ${action} operation completed!`, 'success');
}

function saveLeaveManagementData() {
    showToast('Leave quotas saved successfully!', 'success');
}

function handleAddHolidaySubmit() {
    const d = document.getElementById('new-holiday-date').value;
    const name = document.getElementById('new-holiday-name').value.trim();
    if (!d || !name) {
        showToast('Please select date and enter festival name', 'error');
        return;
    }

    FESTIVAL_LEAVES_DATA.push({
        srNo: FESTIVAL_LEAVES_DATA.length + 1,
        date: d.replace(/-/g, '/'),
        festival: name
    });

    renderLeaveListTable();
    showToast(`Festival "${name}" added!`, 'success');
    document.getElementById('new-holiday-date').value = '';
    document.getElementById('new-holiday-name').value = '';
}

function toggleSelectAllClients(masterChk) {
    const checkboxes = document.querySelectorAll('.chk-client-row');
    checkboxes.forEach(c => c.checked = masterChk.checked);
}

document.addEventListener('DOMContentLoaded', () => {
    const passInput = document.getElementById('sec-password');
    if (passInput) setTimeout(() => passInput.focus(), 300);
});
